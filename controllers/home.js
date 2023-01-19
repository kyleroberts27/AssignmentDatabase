const Teams = require('../models/Teams');

exports.list = async (req, res) => {
    console.log(req.session);
    try {

    
        const totalTeams = await Teams.find({}).count();

        const totalGoals = await Teams.aggregate([
            { $group: { _id: "$goals", total: { $sum: 1 } } },
            { $count: "total" }
        ])
        console.log(totalGoals)
        const totalShots = await Teams.aggregate([
            { $group: { _id: "$shots_total", total: { $sum: 1 } } },
            { $count: "total" }
        ])
        console.log(totalShots)
        const totalShotsOnTarget = await Teams.aggregate([
            { $group: { _id: "$shots_on_total", total: { $sum: 1 } } },
            { $count: "total" }
        ])
        console.log(totalShotsOnTarget);
        
        res.render("index", { totalTeams: totalTeams, totalGoals: totalGoals, totalShots: totalShots, totalShotsOnTarget: totalShotsOnTarget});

    } catch (e) {
        console.log(e);
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}