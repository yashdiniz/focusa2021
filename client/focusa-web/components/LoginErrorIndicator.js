import Link from "next/link"
import Layout from "./Layout"

export default function LoginErrorIndicator() {
    return (
        <Layout>
            <p>
                It seems you are not logged in.{' '}
                Go to <Link href="/login">Login.</Link>
            </p>
        </Layout>
    )
}