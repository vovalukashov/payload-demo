import type { Access } from 'payload'

import { isSuperAdmin } from '../../../access/isSuperAdmin'
import { Tenant } from '@/payload-types'

export const filterByTenantRead: Access = (args) => {
  // Allow public tenants to be read by anyone
  if (!args.req.user) {
    return {
      allowPublicRead: {
        equals: true,
      },
    }
  }

  return true
}

export const canMutateTenant: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return {
    id: {
      in:
        req.user?.tenants
          ?.map(({ roles, tenant }) =>
            roles?.includes('tenant-admin')
              ? tenant && (typeof tenant === 'string' ? tenant : (tenant as Tenant).id)
              : null,
          )
          .filter(Boolean) || [],
    },
  }
}
