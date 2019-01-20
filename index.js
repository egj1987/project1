import { select } from "d3-selection";
import { json } from "d3-fetch"

const d3 = {
    select,
    json
};

const url_cn = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '720'"
const url_uk = "https://opendata.cbs.nl/ODataApi/odata/81271ned/TypedDataSet?$filter=Landen eq '006'"

Promise.all([
    d3.json(url_cn),
    d3.json(url_uk)
])
.then((data_cn, data_uk) => {
 console.log([data_cn, data_uk]);
});

