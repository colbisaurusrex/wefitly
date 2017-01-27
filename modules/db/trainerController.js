const TrainerModel = require('./trainerMethods.js')

module.exports = {

    signin: function(req, res){
      console.log('trainer signin controller')
      const password = req.body.password;
      const email = req.body.email;
      TrainerModel.comparePassword(email, password, (err, isMatch) => {
        if (err) {
          res.end(err);
        }
        if (isMatch) {
          req.session.isTrainer = true;
          req.session.email = email;
          req.session.save();
          res.end('success');
        } else {
          res.sendStatus(504);
        }
      });
    },

    signup: function(req, res){
      console.log('trainer signup controller')
      const user = req.body;
      TrainerModel.signup(user, (err) => {
        if (err){
          console.log('failed')
          res.end('fail')
        }else {
          req.session.isTrainer = true;
          req.session.email = user.email;
          req.session.save();
          res.end('success');
        }
      });
    },

    filter: function(req, res){
      console.log('trainer filter')
      const location = req.query.location;
      TrainerModel.filterTrainers(location, (results) => {
        res.json(results);
      });
    },

    getAll: function(req, res){
      console.log('trainer getall')
      TrainerModel.findAllTrainers((results) => {
        res.json(results);
      });
    },

    updateTrainer: function(req, res){
      if (req.session){
        if (req.session.isTrainer){
          const updateObj = {
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            bio:req.body.bio,
            services:{
              '1on1':req.body.oneonone?true:false,
              'dietcons':req.body.dietcons?true:false,
              'group':req.body.group?true:false,
              'remote':req.body.remote?true:false,
            },
            rate:req.body.rate
          }
          TrainerModel.updateTrainer(req.session.email,updateObj,(err)=>{
            if (err){
              res.sendStatus(504);
            }else{
              res.end('success');
            }
          })
        }else{
          res.sendStatus(401);
        }
      }else{
        console.log('unauth on profile');
        res.sendStatus(401);
      }
    }
};


