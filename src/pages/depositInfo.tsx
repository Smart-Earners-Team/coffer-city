import React from 'react'
import Layout from '../components/wrap'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

const DepositInfo = () => {

    const { depositId } = useParams();

    return (
        <React.Fragment>
            <Helmet>
                <title>Overview ID {`${depositId}`} | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default DepositInfo