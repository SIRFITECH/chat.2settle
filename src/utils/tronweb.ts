import { TronWeb } from "tronweb";
const tronweb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    // headers: { 'TRON-PRO-API-KEY':'API-KEY'}
});
export default tronweb;
