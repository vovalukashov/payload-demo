import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { isSuperAdmin } from '../../../access/isSuperAdmin'
import { Access } from 'payload'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { getCollectionIDType } from '@/utilities/getCollectionIDType'

export const superAdminOrTenantUserAccess: Access = async ({ req }) => {
  if (!req.user) {
    return false
  }

  const blogTenant = await req.payload.find({
    collection: 'tenants',
    where: {
      slug: {
        equals: '/blog',
      },
    },
  })

  if (!blogTenant.docs?.[0]?.id) {
    return false
  }

  const blogTenantId = blogTenant.docs[0].id

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  if (selectedTenant !== blogTenantId) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  const isTenantAdmin = getUserTenantIDs(req.user, 'tenant-admin')
  const isTenantEditor = getUserTenantIDs(req.user, 'tenant-editor')

  const hasAccess = isTenantAdmin.includes(blogTenantId) || isTenantEditor.includes(blogTenantId)

  if (!hasAccess) {
    return false
  }

  return true
}
