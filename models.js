const Sequelize = require('sequelize');
const sequelize = new Sequelize('YOUR DATABASE CONNECTION');

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

Person.create({name: "daria"}).then(person => {
  console.log("person: ", person)
  Pet.create({name: "frankie", type: "cat" }).then(pet => {
    person.setPet(pet)  //creates association between 'frankie' and 'daria'
  })
})

//You can do either
// Person.findOne({where: {name: "daria"}, include: [Pet]}).then(person => console.log("pet: ", person))
//or Person.findOne({where: {name: "daria"}}).then(person => person.getPet())

//Console logging the functions
Person.findOne({where: {name: "daria"}}).then(person => {
  console.log("setPet: ", person.setPet)
  console.log("getPet: ", person.getPet)}
);

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
Pet.belongsToMany(Company, {through: 'CompanyPet'})

Pet.findOne({where: {name: "frankie"}}).then(pet =>
  Company.create({name: 'Hack Reactor'}).then(company => {
    pet.setCompanies(company) //add association between frankie and Hack Reactor to CompanyPet
  })
)


sequelize.sync() //DON'T FORGET MEEEE

// console.log("sequelize: ", sequelize)
