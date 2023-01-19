const Teams = require("../models/Teams");
const Team = require("../models/Team");
const bodyParser = require("body-parser");
const { findById } = require("../models/Teams");


exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;


  try {
    const teams = await Teams.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Teams.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("teams", {
      teams: teams,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "could not list teams" });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Team.find({});
    const teams = await Teams.findById(id);
    if (!teams) throw Error('cant find teams');
    res.render('update-team', {
      teams: teams,
      team: team,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('create-team', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find team ${id}`,
    });
  }
};

exports.create = async (req, res) => {
  try {

    const teams = await Teams.findById(req.body.team_id);
    await Teams.create({
      team_id: req.body.team_id,
      team: req.body.team 
      
    })

    res.redirect('/teams/?message=team has been created')
  } catch (e) {
    if (e.errors) {
      res.render('create-team', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.createView = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.render("create-team", {
      teams: teams,
      errors: {}
    });

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Team.findByIdAndRemove(id);
    res.redirect("/teams");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Teams.updateOne({ _id: id }, req.body);
    res.redirect('/teams/?message=team has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find taster ${id}.`,
    });
  }
};

