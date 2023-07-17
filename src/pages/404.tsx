import React from 'react';
import { Link } from 'react-router-dom';
import err404 from './../assets/images/error404.jpg'
import { Helmet } from 'react-helmet'

const Page404 = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>This Page is Not Found</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white gap-2">
                <img src={err404} alt="404" className="w-[50%] object-cover mb-10" />
                <p className="mt-2 text-xl text-cyan-500">Page not found</p>
                <Link className='p-2 text-sm font-bold rounded-lg bg-cyan-500 text-slate-50' to={'/'}>Home</Link>
            </div>
        </React.Fragment>
    );
}

export default Page404
