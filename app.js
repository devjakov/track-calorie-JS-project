// Storage controller
const StorageCtrl = (function(){

    // Public methods
    return {
        storeItem: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];

                // push new item into array
                items.push(item);
                // Set LS with new item
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                // push new item
                items.push(item);

                // Set LS with new item
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items = [];
            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = StorageCtrl.getItemsFromStorage();

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = StorageCtrl.getItemsFromStorage();

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

// item controller
const ItemCtrl = (function () {
//   item constructor
    const Item = function(id, name, calories){
        this.id = id
        this.name = name;
        this.calories = calories;
    }

    // Data structure / States
    const data = {
        // items: [
        //      {id:0, name: 'Steak Dinner', calories: 850},
        //      {id:1, name: 'Cookie', calories: 300},
        //      {id:2, name: 'Eggs', calories: 200}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }


    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        logData: function(){
            return data;
        },
        addItem: function(name, calories){
            let ID;
            console.log(name,calories)
            // create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            const newItem = new Item(ID, name, calories);

            data.items.push(newItem);

            return newItem;

        },
        getTotalCalories: function() {
            let total = 0;

            // Loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },
        getItemById: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        updateItem: function(name, calories){
            // Calories to Number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id){
            // get ids
            ids = data.items.map(function(item){
                console.log(item.id)
                return item.id;
            });
            console.log(ids)
            // get index
            const index = ids.indexOf(id);
            console.log(index)
            data.items.splice(index, 1);
        },
        clearItems: function(){
            data.items = [];
        }
    }
})();

// UI controller
const UICtrl = (function () {

    const UISelectors = {
        itemlist: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }


    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemlist).innerHTML = html;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function(total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function() {
            console.log('edit stte');
            UICtrl.clearInput();
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState: function(){
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updateListItem: function(item){
            // Turn node list into array
            // listItems = Array.from(listItems);

            // listItems.forEach(function(listItem){
            //     const itemID = listItem.getAttribute('id');

            //     if(itemID === `item-${item.id}`){
            //         document.querySelector(`#${itemID}`).innerHTML = ``
            //     }
            // })

            // I realized the code above is unnecessary and i can just use current item
            // since I update it right before showing in UI :D
            const currentItem = ItemCtrl.getCurrentItem();
            document.querySelector(`#item-${currentItem.id}`).innerHTML = `<strong>${currentItem.name}: </strong> <em>${currentItem.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;

        },
        deleteListItem: function(id) {
            document.querySelector(`#item-${id}`).remove();
        },
        clearAll: function(){
            // reset items to empty array
            ItemCtrl.clearItems();

            // Empty inputs and reset
            UICtrl.clearEditState();

            StorageCtrl.clearStorage();

            // remove all lists
           let listItems = document.querySelectorAll(UISelectors.listItems);

           listItems = Array.from(listItems);

           listItems.forEach(function(item){
               item.remove();
           });

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show calories in UI
            UICtrl.showTotalCalories(totalCalories);
        }
    }

})();

// App controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {

    const loadEventListeners = function() {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemlist).addEventListener('click', itemEditClick);

        // Item update event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // delete item button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Clear All button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', UICtrl.clearAll);
    }

    const itemAddSubmit = function(e){
        e.preventDefault();

        const input = UICtrl.getItemInput();

        // Check if inputs are empty
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to the UI by simply calling populateItemList() again
            const items = ItemCtrl.getItems();
            UICtrl.populateItemList(items);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show calories in UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear input fields
            UICtrl.clearInput();
        }
    }

    // Click edit item
    const itemEditClick = function(e) {
        console.log(e);
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentElement.parentElement.id;
            console.log(listId);
            // List ID returns "item-#" but we want only the #
            const listIdArr = listId.split('-');
            console.log(listIdArr);

            // get Number from list id
            const id = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set curent item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        };

        e.preventDefault();
    }

    const itemUpdateSubmit = function(e) {

        e.preventDefault();

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

         // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories();

         // show calories in UI
         UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

         // Set initial state / clear edit state
         UICtrl.clearEditState();
    }

    const itemDeleteSubmit = function(e) {
        e.preventDefault();
        console.log(e);

        const currentItem = ItemCtrl.getCurrentItem();

        // delete from array
        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.deleteListItem(currentItem.id);

         // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories();

         // show calories in UI
         UICtrl.showTotalCalories(totalCalories);

        //  Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

         // Set initial state / clear edit state
         UICtrl.clearEditState();
    }


    // Public methods
    return {
        init: function(){
            // Set initial state / clear edit state
            UICtrl.clearEditState();

            console.log('Initializing App...')

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            console.log(items);

            // Populate list with items
            UICtrl.populateItemList(items);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show calories in UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize app
App.init();