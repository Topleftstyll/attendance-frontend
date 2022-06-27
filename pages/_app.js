import { Layout } from '../components'
import { AuthContext } from '../context/AuthContext'
import '../styles/globals.css'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps }) {
  return (
    <AuthContext>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext>
  )
}

export default MyApp
