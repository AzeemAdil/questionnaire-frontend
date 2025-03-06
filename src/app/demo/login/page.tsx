import AuthPageLayout from '@/common/authPageLayout'
import LoginPage from '@/components/login'
import React from 'react'

const page = () => {
  return (
    <AuthPageLayout>
      <LoginPage />
    </AuthPageLayout>
  )
}

export default page