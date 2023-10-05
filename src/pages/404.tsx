import React from 'react';
import { Link } from 'react-router-dom';
import err404 from './../assets/images/error404.jpg'
import { Helmet } from 'react-helmet'

const Page404 = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>This Page is Not Found</title>
                {/* <!-- Meta --> */}
                <meta charSet="utf-8" />

                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                <meta name="viewport" content="width=device-width,initial-scale=1" />

                {/* <!-- The above 3 meta tags must come first in the head; any other head content must come after these tags --> */}
                <meta name="description" content="Crypto Saving Made Simple, Smart, and Secure. Powered by decentralized blockchain technology. Start saving your crypto today!" />

                <meta name="keywords" content="blockchain, dApp, decentralized applications, DeFi, decentralized finance, NFT, non-fungible tokens, cryptocurrency, crypto, Bitcoin, Binance Smart Chain, how to save money in cryptocurrency, save with crypto, how to save crypto in wallet, where can I save my bitcoin, how to save money in bitcoin, save in dollars, how to save cryptocurrency, save with crypto, save in dollars in nigeria, save in bitcoin, safe haven crypto, how to save cryptocurrency, how to save crypto, Save crypto to usd, Saving in dollars in Nigeria, How to save in US dollar in nigeria" />

                <meta property="og:site_name" content="Crypto Saving Made Simple, Smart, and Secure." />

                <meta property="og:title" content="Crypto Saving Made Simple, Smart, and Secure. " />

                <meta property="og:type" content="website" />

                <meta property="og:description" content="Crypto Saving Made Simple, Smart, and Secure. Powered by decentralized blockchain technology. Start saving your crypto today!" />

                <meta property="og:image" content="https://coffer.city/images/share.jpg" />

                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="512" />
                <meta property="og:image:height" content="315" />
                <meta property="og:url" content="https://coffer.city" />
                <meta property="twitter:card" content="summary_large_image" />

                <meta name="title" content="&quot;Coffer City offers the feature to top-up your deposits every week. It's an excellent way to save more when you have spare cash.&quot;" />

                <link rel="canonical" href="https://coffer.city" />

                <link rel="icon" type="image/png" href="images/favicon.png" />
                <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
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
