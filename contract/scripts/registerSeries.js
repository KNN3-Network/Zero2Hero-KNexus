const KNexus = artifacts.require("KNexus");


module.exports = async function (callback) {
    try {
        const kNexus = await KNexus.at("0xdc381a59532215Ded31113e0C8DDF585825B5bAC");

        const tx = await kNexus.registerSeries("qknow1", 1517)

        console.log("tx tx", tx);
        callback();

    } catch (error) {
        console.log("error", error);
    }
};
