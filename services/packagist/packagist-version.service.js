import Joi from 'joi'
import { renderVersionBadge } from '../version.js'
import { optionalUrl } from '../validators.js'
import { redirector } from '../index.js'
import {
  allVersionsSchema,
  keywords,
  BasePackagistService,
  customServerDocumentationFragment,
} from './packagist-base.js'

const packageSchema = Joi.array().items(
  Joi.object({
    version: Joi.string().required(),
  })
)

const schema = Joi.object({
  packages: Joi.object().pattern(/^/, packageSchema).required(),
}).required()

const queryParamSchema = Joi.object({
  server: optionalUrl,
  include_prereleases: Joi.equal(''),
}).required()

class PackagistVersion extends BasePackagistService {
  static category = 'version'

  static route = {
    base: 'packagist/v',
    pattern: ':user/:repo',
    queryParamSchema,
  }

  static examples = [
    {
      title: 'Packagist Version',
      namedParams: {
        user: 'symfony',
        repo: 'symfony',
      },
      staticPreview: renderVersionBadge({ version: '4.2.2' }),
      keywords,
    },
    {
      title: 'Packagist Version (including pre-releases)',
      namedParams: {
        user: 'symfony',
        repo: 'symfony',
      },
      queryParams: { include_prereleases: null },
      staticPreview: renderVersionBadge({ version: '4.3-dev' }),
      keywords,
    },
    {
      title: 'Packagist Version (custom server)',
      namedParams: {
        user: 'symfony',
        repo: 'symfony',
      },
      queryParams: {
        server: 'https://packagist.org',
      },
      staticPreview: renderVersionBadge({ version: '4.2.2' }),
      keywords,
      documentation: customServerDocumentationFragment,
    },
  ]

  static defaultBadgeData = {
    label: 'packagist',
  }

  static render({ version }) {
    return renderVersionBadge({ version })
  }

  async handle(
    { user, repo },
    { include_prereleases: includePrereleases, server }
  ) {
    includePrereleases = includePrereleases !== undefined
    const json = await this.fetch({
      user,
      repo,
      schema: includePrereleases ? schema : allVersionsSchema,
      server,
    })
    const versions = json.packages[this.getPackageName(user, repo)]
    const { version } = this.findLatestRelease(versions, includePrereleases)
    return this.constructor.render({ version })
  }
}

const PackagistVersionRedirector = redirector({
  category: 'version',
  route: {
    base: 'packagist/vpre',
    pattern: ':user/:repo',
  },
  transformPath: ({ user, repo }) => `/packagist/v/${user}/${repo}`,
  transformQueryParams: params => ({ include_prereleases: null }),
  dateAdded: new Date('2019-12-15'),
})

export { PackagistVersion, PackagistVersionRedirector }
