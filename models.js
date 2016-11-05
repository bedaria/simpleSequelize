const Sequelize = require('sequelize');
const sequelize = new Sequelize('YOUR DATABASE');

sequelize.authenticate()
.then(() => console.log("Connected to db"))
.catch(error => console.log("Failed to conenct to db: ", error))

const Pet = sequelize.define('pet',
  {
    name: Sequelize.STRING,
    type: Sequelize.STRING
  }
)

const Person = sequelize.define('person',
  {
    name: Sequelize.STRING
  }, {
    hooks: {
      beforeCreate: (instance) => console.log("YOURE ABOUT TO ADD ", instance.name)
    }
  }
)

const Company = sequelize.define('company',
  {
    name: Sequelize.STRING
  }
)

const marco = Person.create({name: "marco"}) //marco is a promise

/******************.hasOne*******************/
Person.hasOne(Pet);
Pet.belongsToMany(Company, {through: 'CompanyPet'})
Pet.belongsToMany(Pet, {as: 'Sibling', through: 'Kitties'}) //renames Target model as Sibling
sequelize.sync() //DON'T FORGET MEEEE

Person.create({name: "daria"}).then(person => {
  Pet.create({name: "frankie", type: "cat" }).then(pet => {
    person.setPet(pet)  //creates association between 'frankie' and 'daria'
  })
})

//To eager load a person with all of his pets, you can do either
Person.findOne({where: {name: "daria"}, include: [Pet]}).then(person => console.log("person: ", person))
//or Person.findOne({where: {name: "daria"}}).then(person => person.getPet())

//Console logging the functions
// Person.findOne({where: {name: "daria"}}).then(person => {
//   console.log("setPet: ", person.setPet)
//   console.log("getPet: ", person.getPet)
//   }
// );

//.setPet
/*function (associatedInstance, options) {
    var instance = this,
      alreadyAssociated;

    options = _.assign({}, options, {
      scope: false
    });
    return instance[association.accessors.get](options).then(function(oldInstance) {
      // Use equals method once #5605 is resolved
      alreadyAssociated = oldInstance && associatedInstance && _.every(association.target.primaryKeyAttributes, function(attribute) {
        return oldInstance.get(attribute, {raw: true}) === associatedInstance.get(attribute, {raw: true});
      });

      if (oldInstance && !alreadyAssociated) {
        oldInstance[association.foreignKey] = null;
        return oldInstance.save(_.extend({}, options, {
          fields: [association.foreignKey],
          allowNull: [association.foreignKey],
          association: true
        }));
      }
    }).then(function() {
      if (associatedInstance && !alreadyAssociated) {
        if (!(associatedInstance instanceof association.target.Instance)) {
          var tmpInstance = {};
          tmpInstance[association.target.primaryKeyAttribute] = associatedInstance;
          associatedInstance = association.target.build(tmpInstance, {
            isNewRecord: false
          });
        }

        _.assign(associatedInstance, association.scope);
        associatedInstance.set(association.foreignKey, instance.get(association.sourceIdentifier));

        return associatedInstance.save(options);
      }
      return null;
    });
  }
  */

//getPet:
/* function (options) {
    return association.get(this, options);
  }
*/


/******************.belongsToMany************************/
Pet.findOne({where: {name: "frankie"}}).then(pet =>
  Company.create({name: 'Hack Reactor'}).then(company => {
    pet.setCompanies(company) //add association between frankie and Hack Reactor to CompanyPet
  })
)

Pet.findOne({where: {name: "frankie"}}).then(pet => {
  Pet.create({name: "aiden"}).then(sibling => {
    // console.log("pet.setSibling: ", pet.setSibling)
    pet.addSibling(sibling)
  })
})
Pet.findOne({include: {model: Pet, as:'Sibling'}}).then(pet => console.log("pet: ", pet))


// console.log("sequelize: ", sequelize)
