$(document).on('DOMContentLoaded', async ()=>{
    function loading(){
        $('.content').addClass('hidden');
        $('.spinner').removeClass('hidden');
        $('body').addClass('load');
        setTimeout(()=>{
            $('.content').removeClass('hidden');
            $('.spinner').addClass('hidden');
        $('body').removeClass('load');

        }, 500)
    }

    loading();
    // side bar
    let flag = true;
    function closeSideBar(){
        $('.fa-bars').toggleClass('fa-close');
        if(flag){
            $('nav').attr('style', 'left: 0px');
            $('.list-none li').attr('style', 'top: 0px');
            flag = false;
        }else{
            $('nav').attr('style', 'left: -195px');
            $('.list-none li').attr('style', 'top: 100%');
            flag = true;
        }
    }
    $('.icon').on('click', ()=>{
        closeSideBar();
        console.log('hi');
    })

    // handel navigation
    const navLinks = $('.list-none li');
    const sections = $('[data-section]');
    navLinks.on('click', function(){
        const ele = $(this).attr('data-target');
        sections.addClass('hidden'); 
        $(`#${ele}`).removeClass('hidden');
        closeSideBar();
        loading();
    })

    // default meals
    async function getApi(random){
        let request = await fetch(`https://www.themealdb.com/api/json/v1/1/${random}`);
        let response = await request.json();
        return response;
    }


    async function displayMeals(key){
        let meals = await getApi(key);
        let data = meals.meals.slice(0, 20);
        let mealContainer = '';
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            mealContainer+=`<div class="card" data-id="${element.idMeal}">
            <img src='${element.strMealThumb}' class="w-full rounded">
            <div class="overlay">
                <h2 class="card-title">${element.strMeal}</h2>
            </div>
            </div>`;
        }
        $('#defaultMeals').empty().append(mealContainer);
        loading();
    }

    await displayMeals("search.php?s");



    // display meals category
    async function displayCategory(key){
        let category = await getApi(key);
        let data = category.categories;
        let categories = '';
        for(let i = 0 ; i < data.length; i++){
            const element = data[i];
            categories += `<div class="card" data-category="${element.strCategory}">
            <img src="${element.strCategoryThumb}">
            <div class="category-overlay">
            <h2 class="card-title">${element.strCategory}</h2>
            <p>${element.strCategoryDescription.slice(0, 150)}</p>
            </div>
            </div>`;
        }
        $('#categoriesContainer').append(categories);
        loading()
    }

    await displayCategory(`categories.php`)

    //display areas
    async function displayArea(key){
        let area = await getApi(key);
        let data = area.meals;
        let areaContainer = "";
        for(let i = 0 ; i < data.length; i++){
            const element = data[i];
            areaContainer += `<div class="card text-white text-center mb-4 md:mb-0" data-area="${element.strArea}">
            <i class="fa-solid fa-house fa-2x"></i>
            <h3 class="card-title">${element.strArea}</h3>
            </div>`
        }
        loading();
        $('#areaContainer').append(areaContainer);
    } 

    await displayArea(`list.php?a=list`)

    // display ingreidents
    async function displayIng(key){
        let ingreidents = await getApi(key);
        console.log(ingreidents.meals.slice(0, 20));
        let data = ingreidents.meals.slice(0, 20);
        let ingContainer = "";
        for(let i =0; i< data.length; i++){
            const element = data[i];
            ingContainer +=`
                <div class="card text-white text-center" data-ingreidents="${element.strIngredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h2 class="card-title">${element.strIngredient}</h2>
                <p>${element.strDescription.slice(0, 100)}</P>
                
                </div>
            `
        }
        loading()
        $("#ingredinetContainer").append(ingContainer);
    }

    await displayIng("list.php?i=list");



    // display meals from category
    $('.card').on('click', function(){
        console.log(this);
        if($(this).attr('data-category')){                
            let id = $(this).attr('data-category');
            displayMeals(`filter.php?c=${id}`);
        }else if($(this).attr('data-area')){
            let id = $(this).attr('data-area');
            displayMeals(`filter.php?a=${id}`);
        }else if($(this).attr('data-ingreidents')){
            let id = $(this).attr('data-ingreidents');
            displayMeals(`filter.php?i=${id}`);
        }
        sections.addClass('hidden'); 
        loading()
        $('#default').removeClass('hidden')
    });

    // display meal info
    $(document).on('click', '.overlay', async function () {
        let mealId = $(this).parent('.card').attr('data-id');
        let info = await getApi(`lookup.php?i=${mealId}`);
        let arr =[];
        console.log(info.meals); // Handle displaying the meal info as needed
        for (let i = 1; i <= 20; i++) {
            let ingredient = info.meals[0][`strIngredient${i}`];
            if (ingredient && ingredient.trim() !== "") {
                arr.push(ingredient)
            }
        }
        let cartoona = '';
        for(let i = 0 ; i < arr.length; i++){
            const element = arr[i];
            cartoona+= `<div class="lg:w-1/5 w-1/3 text-center bg-slate-400 lg:p-2 p-[.1rem] rounded">${element}</div>`;
        }
        let infoContainer = `                
                <div class="md:w-5/12">
                    <figure>
                        <img src="${info.meals[0].strMealThumb}" class="w-2/3 mx-auto rounded" alt="">
                    </figure>
                    <h2 class="card-title text-center">${info.meals[0].strMeal}</h2>
                </div>
                <div class="md:w-7/12 text">
                    <i class="fa-solid fa-close fa-2x absolute right-0 md:-top-4 top-0 fa-info"></i>
                    <h2 class="card-title">Instructions</h2>
                    <p>${info.meals[0].strInstructions}</p>
                    <h2 class="card-title my-3">Area : ${info.meals[0].strArea}</h2>
                    <h2 class="card-title mb-3">Category : ${info.meals[0].strCategory}</h2>
                    <h2 class="card-title mb-3">Recipes :</h2>
                    <div class="flex flex-wrap gap-3 my-4" id="mealIngredients">
                    ${cartoona}
                    </div>
                    <div>
                        <h2c class="card-title">Tags : ${info.meals[0].strTags}</h2c>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="my-4">
                        <button class="p-2 rounded bg-green-600"><a href="${info.meals[0].strSource}" target="_blanck">Source</a></button>
                        <button class="p-2 rounded bg-red-600"><a href="${info.meals[0].strYoutube}" target="_blanck">Youtube</a></button>
                    </div>
                </div>`;
                loading()
        $('#infoContianer').empty().append(infoContainer);
        sections.addClass('hidden'); 
        $("#mealInfo").removeClass('hidden');
    });
    // Close meal info
    $(document).on('click', '.fa-info', function () {
        loading();
        $('#mealInfo').addClass('hidden');
        $('#default').removeClass('hidden');
    });
    // Input fields
const userName = $("#userName");
const userAge = $("#userAge");
const userEmail = $("#userEmail");
const userPhone = $("#userPhone");
const userPass = $("#userPass");
const userRepass = $("#userRepass");

// Regular expression patterns
const regex = {
    userName: /^[a-zA-Z]{3,20}$/,
    userAge: /^[0-9]{1,2}$/,
    userEmail:  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    userPhone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    userPass:  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    userRepass:  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
};

// Function to check if a field is valid and apply error styling if not
function validateField(input, regexPattern) {
    const value = input.val();
    const isValid = regexPattern.test(value);
    console.log(input.next(`#${input.next().attr('id')}`));

    if (isValid) {
        input.removeClass('error');
        input.next(`#${input.next().attr('id')}`).addClass('hidden');
        console.log('hidden');
    } else {
        input.addClass('error');
        input.next(`#${input.next().attr('id')}`).removeClass('hidden');
        console.log('visible');
    }

    return isValid;
}

// Function to check if passwords match
function validatePasswordMatch() {
    const isValid = userPass.val() === userRepass.val();
    const errorElement = userRepass.next(`#${userRepass.next().attr('id')}`);

    if (isValid) {
        userRepass.removeClass('error');
        errorElement.addClass('hidden');
    } else {
        userRepass.addClass('error');
        errorElement.removeClass('hidden');
    }

    return isValid;
}
    
// Event listener on input fields
$(document).on('input', '#userName, #userAge, #userEmail, #userPhone, #userPass, #userRepass', function() {
    validateField($(this), regex[$(this).attr('id')]);
    if (validateField(userName, regex.userName) &&
    validateField(userEmail, regex.userEmail) &&
    validateField(userPhone, regex.userPhone) &&
    validateField(userAge, regex.userAge) &&
    validateField(userPass, regex.userPass) &&
    validatePasswordMatch()) {
    $('button').removeAttr('disabled');
    $('button').addClass('enabled');
} else {
    $('button').attr('disabled', 'disabled');
    $('button').removeClass('enabled');
}
    
});
    // Event handler for name input search
    $('#name').on('input', async function() {
        const searchValue = $(this).val();
        let response = await getApi(`search.php?s=${searchValue}`);
        console.log(response.meals.slice(0, 20));
        let meals = response.meals.slice(0, 20);
        let searchedMealsContainer = '';
        for(let i = 0 ; i < meals.length; i++){
            const element = meals[i];
            searchedMealsContainer += `<div class="card" data-id="${element.idMeal}">
            <img src='${element.strMealThumb}' class="w-full rounded">
            <div class="overlay">
                <h2 class="card-title">${element.strMeal}</h2>
            </div>
            </div>`;
        }
        loading()
        $('#searchedMeals').empty().append(searchedMealsContainer);
    });

    // Event handler for first letter input search
    $('#letter').on('input', async function() {
        const searchValue = $(this).val();
        let response = await getApi(`search.php?f=${searchValue}`);
        console.log(response.meals.slice(0, 20));
        let meals = response.meals.slice(0, 20);
        let searchedMealsContainer = '';
        for(let i = 0 ; i < meals.length; i++){
            const element = meals[i];
            searchedMealsContainer += `<div class="card" data-id="${element.idMeal}">
            <img src='${element.strMealThumb}' class="w-full rounded">
            <div class="overlay">
                <h2 class="card-title">${element.strMeal}</h2>
            </div>
            </div>`;
        }
        loading()
        $('#searchedMeals').empty().append(searchedMealsContainer);
    });
})
