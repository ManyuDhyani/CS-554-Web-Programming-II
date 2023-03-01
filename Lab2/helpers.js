let { ObjectId } = require('mongodb')

const nameValidator = async(name) => {

    // Name Validations
    if (!name) throw {statusCode: 400, error: "Name cannot be empty"};
    name = name.trim()
    if (typeof name !== "string") throw {statusCode: 400, error: "Name should be a valid string"};
    if (name.trim().length === 0) throw {statusCode: 400, error: "Name cannot be just empty spaces"};
    if (/^[a-zA-Z ]*$/.test(name) == false) throw  {statusCode: 400, error: "Name can only be alphabet characters"};
    if (name.length < 2) throw {statusCode: 400, error: "Name must be at least 2 characters long"};
}

const createValidator = async (username, password) => {

    if (!username || !password) throw {statusCode: 400, error: "Username or Password cannot be empty"};

    // Username Validations
    if (typeof username !== "string") throw {statusCode: 400, error: "Username should be a valid string"};
    if (username.trim().length === 0) throw {statusCode: 400, error: "Username cannot be just empty spaces"};
    let checkSpaces = username.split(" ");
    if (checkSpaces.length > 1) throw {statusCode: 400, error: "No spaces in the username is allowed"};
    if(/^[0-9]*$/.test(username) === true) throw {statusCode: 400, error: "Username cannot be all numeric"};
    if (/^[0-9a-zA-Z]+$/ .test(username) === false) throw  {statusCode: 400, error: "Username can be only alphanumeric characters"};
    if (username.length < 3) throw {statusCode: 400, error: "Username should be at least 4 characters long"};

    // Password Validations
    if (typeof password !== "string") throw {statusCode: 400, error: "Password should be a valid string"};
    checkSpaces = password.split(" ");
    if (checkSpaces.length > 1) throw {statusCode: 400, error: "No spaces in the password is allowed"};
    if (/(?=.*\d)(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/.test(password) === false) throw {statusCode: 400, error: "Password should have at least one uppercase character & there has to be at least one number & there has to be at least one special character"};
    if (password.length < 6) throw {statusCode: 400, error: "Password should be at least 6 characters long"};
};
     


const idValidator = async (id) => {
    
    // Error Handling for id

    if (!id){ 
        throw {statusCode: 400, error: 'Id cannot be empty'};
    }
    if (typeof id !== "string"){ 
        throw {statusCode: 400, error: 'Id must be a string'};
    }
    if (id.length === 0 || id.trim().length === 0){
        throw {statusCode: 400, error: 'Id cannot be an empty string or just spaces'};
    }

    id = id.trim();
  
    if (!ObjectId.isValid(id)){ 
        throw {statusCode: 400, error: 'Invalid ID'};
    }
};

// Recipes Validations

const createRecipeValidator = async(title, ingredients, cookingSkillRequired, steps) => {
    if (!title || !ingredients || !steps || !cookingSkillRequired) {
        throw {statusCode: 400, error  :"All fields need to have valid values"};
    }

    // Title
    if (typeof title !== "string" || title.length === 0 || title.trim().length === 0){
        throw {statusCode: 400, error  :"Invalid String or Empty Title or Title with just spaces"};
    }
    
    title = title.trim(); 

    if (title.length < 2){
        throw {statusCode: 400, error:"Title must be at least two characters long"};
    }

    const regexTitle = /^[0-9a-zA-Z ]+$/;
    if (!regexTitle.test(title)){
        throw {statusCode: 400, error:"Title can contain letters a-z, A-Z or numbers only."};
    }

    // Ingredients
    if (ingredients.length === 0) throw {statusCode: 400, error: "The ingredients list cannot be empty"};
    if (ingredients.length < 3) throw {statusCode: 400, error: "There should be atleast 3 ingredients"};

    ingredients.forEach(ingredient => {
        if (typeof ingredient !== "string" || ingredient.length === 0 || ingredient.trim().length === 0){
            throw {statusCode: 400, error:"Invalid String or Empty ingredient or ingredient with just spaces"};
        }
        
        ingredient = ingredient.trim();
    
        if (ingredient.length < 3 || ingredient.length > 50){
            throw {statusCode: 400, error:"Ingredient must be at least 3 characters and at max 50 characters long."};
        }
    
        const regexTitle = /^[0-9a-zA-Z .,@&():;!]+$/;
        if (!regexTitle.test(ingredient)){
            throw {statusCode: 400, error  :"Ingredients can contain letters a-z, A-Z, numbers and .,@&():;! only."}
        }
    });

    // Steps
    if (steps.length === 0) throw {statusCode: 400, error: "The Steps list cannot be empty"};
    if (steps.length < 5) throw {statusCode: 400, error: "There should be atleast 5 steps"};

    steps.forEach(step => {
        if (typeof step !== "string" || step.length === 0 || step.trim().length === 0){
            throw {statusCode: 400, error:"Invalid String or Empty step or step with just spaces"};
        }

        //  there should be at least 5 valid string elements in the array. *************************

        if (step.length < 20) throw {statusCode: 400, error: "A step cannot be less than 20 characters"};

        const regexTitle = /^[0-9a-zA-Z .,@&():;!]+$/;
        if (!regexTitle.test(step)){
            throw {statusCode: 400, error  :"Step can contain letters a-z, A-Z, numbers and .,@&():;! only"}
        }
    });
    

    // Cooking Skill Required
    let cookingSkillRequiredArray = ["novice", "intermediate", "advanced"]
    let flag = 0;
    for (skill of cookingSkillRequiredArray)  {
        if (cookingSkillRequired.toLowerCase() === skill){
            flag =1;
            break;
        }
    }
    if (flag === 0){
        throw {statusCode: 400, error: "Invalid cooking skill required"};
    }
};


const commentValidator = async (comment) => {
    if (!comment) throw {statusCode: 400, error:"The comment field need to have valid values"};
    if (typeof comment !== "string" || comment.length === 0 || comment.trim().length === 0){
        throw {statusCode: 400, error  :"Invalid String or Empty comment or comment with just spaces"};
    }
}

module.exports = {
    nameValidator,
    createValidator,
    idValidator,
    createRecipeValidator,
    commentValidator
};