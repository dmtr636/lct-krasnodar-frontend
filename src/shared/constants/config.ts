// const DEVELOPMENT_DOMAIN = "http://localhost:8080";
const DEVELOPMENT_DOMAIN = "https://hack-kydas.ru";

const PRODUCTION_DOMAIN = "https://hack-kydas.ru";

let domain: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    domain = DEVELOPMENT_DOMAIN;
} else {
    domain = PRODUCTION_DOMAIN;
}

export { domain };
