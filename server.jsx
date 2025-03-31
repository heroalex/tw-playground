// noinspection JSUnresolvedReference

import {Hono} from 'hono';
import {languageDetector} from 'hono/language';
import {serveStatic} from 'hono/bun';
import {logger} from 'hono/logger';
import {createContext, useContext} from 'hono/jsx';

import {i18n} from "./i18n";

const app = new Hono();

app.use(logger());

// Serve static files from the public directory.
// noinspection JSCheckFunctionSignatures
app.use('/*', serveStatic({root: './public', precompressed: true}));

app.use(
    languageDetector({
        supportedLanguages: ['en', 'de'],
        fallbackLanguage: 'en',
    })
);

app.use(async (c, next) => {
    console.log(`[${c.req.method}] ${c.req.url}`)
    await next()
})

app.get('/', (c) => {
    const lang = c.get('language');
    const t = i18n[lang];

    return c.html(
        <AppContext.Provider value={{authenticated: false, t, lang}}>
            <HomePage/>
        </AppContext.Provider>
    )
});

app.get('/version', (c) => {
    return c.html(
        <p>
            {Bun.version}
        </p>
    );
});

function HomePage() {
    const {t} = useContext(AppContext);
    return (
        <Layout>
            <p className="grid">
                <button hx-get="/version" hx-target="#version">Get Bun Version</button>
                <button hx-get="/omada" hx-target="#omada">Get Omada Version</button>
            </p>
            <div id="version"></div>
            <div id="omada"></div>
        </Layout>
    );
}

function Header() {
    const {t} = useContext(AppContext);
    // noinspection CheckImageSize
    return (<header className="container">
        <nav>
            <ul>
                <li>
                    <a href="/">
                        <img alt="" width="32" height="32" src="/img/Logo_128.webp"/>
                        <span className="logoText">{t.appTitle}</span>
                    </a>
                </li>
            </ul>

            <ul>
                <li><a href="/?lang=en"><img alt="EN"
                                             src="data:image/png;base64,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"
                                             style="height: 1.5em;min-width: fit-content;"/></a>
                </li>
                <li><a href="/?lang=de"><img alt="DE"
                                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADqUExURUdwTHljC39nAqYZFXFkM2BgYGJiYnNFK21oU1lZWZAAAGlpaRgXF3xlC49wAoNsDqKHFQAAAGdnZ3ljC35pDXVfBnpkCzs7OxQUFBwCABgYGP8lJCQkJAMDA9gCAvzSJPMaGRcWFtSpBB0dHd0HBwsLC+cPD/jOI/kgIPPHHtqwB9+3Cw8SEu4TE+zBGOa7EuMICaeICpN4DbeXEjg4OMSfDNSvGNgaFxAiIktLS/4TIEJCQiwsLOt+Fv3iJLsaGO4FC+fOD8IBAaYAADcPDfYHF/pNIogVFE8dHPyYJdpaCGolJKcqHLp0GHQcY+EAAAAbdFJOUwBd/qI79dUKI/2tbaPgrfOiraaEtJzLkbStqY+II5sAAAONSURBVFjD7dd5c5pgEAbw2qKYpiZtjqYdiAFBDhEheEUlVXN4NPb7f53u7vtyeSftH+2Mz0wyDiM/nl1wRt+9O+SQQ/7JiGIxjii+TRCE4+Ozs0Ihf0TJ5wtnx8fFV2EiEiDkwej1BoMWy6DXO8oXroTUxbZNggYRaLRaYShrmqqqdVXV5LA1GAw+RaeLV1frGsIyhMjgNRhSr1er15RqXZNlLYG+hYMjmFfA9WGK0TISIwQDomGZBEJKVRPoS1Vm88L+Cvx8mqTHapDBsgO6vlblMGzhwD08fcD2GYYZZC+IDkHx1Ckyzi8vO5kdrYXwaLVah6gULcPKYSzthqooVZmkUXijMPm/D5R2iEozIf/bezSU6FnTUqNFVCjLS86W0aJGiRM3ku8wqvbEQtz2RpGTWjYI8uzlZboYdruuO4Lo5fLDdDqDght3FC87Iu7C2ct02LUkSepLfcV1Dd/XfV33wesuZgn0PXPX2GRA0STQY7ogA2NZiqK4hgFKmaK7bvdDDH2cTp8yTxLk7k4DYzGMjQ2Q0R2moMey//A4ncEGsczT04yWoWQMDlnboYcyzjuCN3R1w3D7GMmS1kgKriiG9FUI4vuGMXIhCgWuviLtHO2BdB0pg1EWQpb0hxAvtK6RtRsqI7QsrWm0c0dLjZQ3N9JRMiLp7+1obSNpH6icuWsbdtR/fh6NYJXcedNdw2dUmkwm9yw/Id2y7u/aUXo0RtzP57YJGWOcsePUapXK/c+to0WNLPqoQIm5ffMDc2OadqPheYAgU3PG486vBDpZDFMQSs/KM6RvTSbzuckNCPSxGeTUKgAB5XWanxPotl2BgemB9Ef4eVMsrJE2WMjhjchxnCUIjsBF+B7vvYZNxs1yqBEV4pKz0oj0MYs5tlnMFYg1YovGc2rOCoTXwF6eB29tEGOaN+ZqId6IoIrjrGmEDDgI2Q0GrTpLUG0thJTnJZViCpuZFNtO73ojxBt5fDTbTIUscqI67Q1QSspW4m3wfjmdTrvdbDZvKc12u1LbNFo0W7wlToBAQAB5HyUIbuFYCgqamUbJkmgUMpA4PS19vbg8z1HOzy+/ltAKEugioJbJfUMJVgVEh9VA4TwnCEtffotC7qIUnMTQJZVEDEfsYNpt3gIMJDZ/wS/mcmLy+rJEEwe3PAERKWPvHwpiDkculU4xJb4KQXzjDx/4qs/yuhKHHHLI/5jfp+iBOPfDyIsAAAAASUVORK5CYII="
                                             style="height: 1.5em;min-width: fit-content;"/></a>
                </li>
                <li><a href="/help">{t.hilfe}</a></li>
                <LoginButton/>
            </ul>
        </nav>
        <h3 style="display: flex; justify-content: center;">{t.homePageWelcome}</h3>
    </header>);
}

function LoginButton() {
    const {t, authenticated} = useContext(AppContext)
    if (authenticated) {
        return (<li><a href="/logout"><span>{t.logOut}</span><span aria-hidden="true">&rarr;</span></a></li>);
    } else {
        return (<li><a href="/login"><span>{t.logIn}</span><span aria-hidden="true">&rarr;</span></a></li>);
    }
}

function Footer() {
    const {t} = useContext(AppContext)
    // noinspection CheckImageSize
    return (<footer className="container">
        <nav>
            <ul>
                <li>
                    <img alt="Logo" width="32" height="32" src="/img/Logo_128.webp"/>
                    <small className="logoText">© 2024</small>
                </li>
            </ul>
            <ul>
                <li><a href="/terms"><small>{t.terms}</small></a></li>
                <li><a href="/instructions"><small>{t.instructions}</small></a></li>
                <li><a href="/privacy"><small>{t.privacy}</small></a></li>
                <li><a href="/contact"><small>{t.contact}</small></a></li>
            </ul>
        </nav>
    </footer>);
}

function Layout({children}) {
    const {lang, t} = useContext(AppContext)
    return (
        <html lang={lang}>
        <head>
            <title>{t.appTitle}</title>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <link rel="stylesheet" href="/css/pico.min.css"/>
            <link rel="stylesheet" href="/css/styles.css"/>
            <script src="/js/htmx@2.0.3.min.js"></script>
        </head>
        <body>
        <Header/>
        <main className="container">{children}</main>
        <Footer/>
        </body>
        </html>
    )
}

const AppContext = createContext({lang: 'en', t: {}, authenticated: false});

/*
 * Utils
 */

export default app;