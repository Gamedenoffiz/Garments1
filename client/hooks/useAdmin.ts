import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  permissions: Record<string, boolean>
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setAdminUser(null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .eq('is_active', true)
          .single()

        if (data && !error) {
          setIsAdmin(true)
          setAdminUser(data)
        } else {
          setIsAdmin(false)
          setAdminUser(null)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
        setAdminUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user])

  const isSuperAdmin = () => {
    return adminUser?.role === 'super_admin'
  }

  const hasPermission = (permission: string) => {
    return adminUser?.permissions?.[permission] === true
  }

  return {
    isAdmin,
    adminUser,
    loading,
    isSuperAdmin,
    hasPermission
  }
}