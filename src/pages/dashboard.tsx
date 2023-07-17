import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"

const Dashboard = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="px-10 md:px-32 py-[50%] md:py-[13%] h-[120%] md:h-[130%]">Dashboard</div>
            </Layout>
        </React.Fragment>
    )
}

export default Dashboard
