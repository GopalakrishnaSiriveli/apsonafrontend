const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const colorInput = document.getElementById('noteColor');
const labelSelect = document.getElementById('noteLabel');
const tagSelect = document.getElementById('noteTags');

// // Get the selected color value
// const noteColor = colorInput.value;
// const noteTags = tagSelect.value;
// // Get the selected label value
// const noteLabel = labelSelect.value;

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
// const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let notes = null;

let isUpdate = false;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

 // Function to logout the user
 function logout() {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Redirect the user to the login page
    window.location.href = 'login.html';
}


async function fetchNotesByUser() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const response = await fetch('https://apsonanotes.onrender.com/notes/api/user/note', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        throw error; // rethrow the error for handling by the caller
    }
}


// function showNotes() {
//     if(!notes) return;
//     document.querySelectorAll(".note").forEach(li => li.remove());
//     notes.forEach((note, id) => {
//         let filterDesc = note.content;
//         // let cid = '663469f9105b21d513b7bbb7';
//         // let date = createdAtDate.toISOString().split('T')[0];
//         let date = extractDateFromCreatedAt(note.createdAt);
//         let label = note.label;
//         let liTag = `<li class="note" style="background-color:${note.color}">
//                         <div class="details">
//                             <p>${note.title}</p>
//                             <span>${filterDesc}</span>
//                         </div>
//                         <div class="bottom-content">
//                             <span>${date}</span>
//                             <span>${note.tags}</span>
//                             <div class="settings">
//                                 <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
//                                 <ul class="menu">
//                                     <li onclick="updateNote('${note._id}', '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
//                                     <li onclick="deleteNote('${note._id}')"><i class="uil uil-trash"></i>Delete</li>
//                                     <li onclick="archiveNote('${note._id}')"><i class="uil uil-archive"></i>Archive</li>
//                                     </ul>
//                             </div>
//                         </div>
//                     </li>`;
//          console.log('show notes');           
//         addBox.insertAdjacentHTML("afterend", liTag);
//     });
// }

function showNotes() {
    if (!notes) return;

    // Clear existing notes displayed in the UI
    document.querySelectorAll(".note").forEach(li => li.remove());
    

    // Filter notes based on archived status (false for non-archived, true for archived)
    const nonArchivedNotes = notes.filter(note => !note.archived);

    nonArchivedNotes.forEach((note, id) => {
        console.log("note.archived");
        let filterDesc = note.content;
        let date = extractDateFromCreatedAt(note.createdAt);

        // Create HTML template for each note
        let liTag = `<li class="note" style="background-color:${note.color}">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        
                        <div class="bottom-content">
                            <span>${date}</span>
                            <span>${note.tags}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote('${note._id}', '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote('${note._id}')"><i class="uil uil-trash"></i>Delete</li>
                                    <li onclick="archiveNote('${note._id}')"><i class="uil uil-archive"></i>Archive</li>
                                </ul>
                                
                            </div>
                    
                        </div>
                    </li>`;

        // Append the note HTML to the DOM
        addBox.insertAdjacentHTML("afterend", liTag);
    });

    console.log('Notes displayed:', nonArchivedNotes);
}



//
async function archiveNote(noteId) {

    console.log("archived");


    try {
        const token = localStorage.getItem('token');
        const confirmArchive = confirm("Are you sure you want to archive this note?");
        if (!confirmArchive) return;
        const response = await fetch(`https://apsonanotes.onrender.com/notes/${noteId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ archived: true }) // Set archived to true for the specified note
        });
        console.log(response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to archive note: ${errorData.message}`);
        }
      // Optionally, you can redirect to the archived page after successful archive
        // window.location.href = './Archived.html';

    } catch (error) {
        console.error('Error archiving note:', error.message);
        // Handle error (e.g., show error message to user)
        alert('Failed to archive note. Please try again.');
    }
}




showNotes();
// Function to extract date part from createdAt string
function extractDateFromCreatedAt(createdAt) {
    try {
        if (!createdAt) return "Unknown"; // Return default value if createdAt is empty or undefined

        let createdAtDate = new Date(createdAt);
        if (isNaN(createdAtDate)) throw new Error("Invalid date string"); // Check if date is valid

        return createdAtDate.toISOString().split('T')[0]; // Extract date part
    } catch (error) {
        console.error("Error extracting date:", error.message);
        return "Unknown"; // Return default value in case of error
    }
}

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// delete Note's by ID
async function deleteNote(noteId) {
    console.log("dlete call");
    try {
        const token = localStorage.getItem('token');
        const confirmDel = confirm("Are you sure you want to delete this note?");
        if (!confirmDel) return;

        const response = await fetch(`https://apsonanotes.onrender.com/notes/deletenotes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response)

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete note: ${errorData.message}`);
        }

        const data = await response.json();
        console.log(data.message); // Log success message from backend

        // After successful deletion from the backend, update localStorage and show updated notes
        // updateLocalStorageAfterDelete(noteId);

    } catch (error) {
        console.error('Error deleting note:', error.message);
        // Handle error (e.g., show error message to user)
        alert('Failed to delete note. Please try again.');
    }
}

// Function to update notes
// async function updateNotess(noteId, title, filterDesc) {
//     console.log("up call")
//     try {
//         // Prepare updated note data
//         const updatedNote = {
//             title: title,
//             content: filterDesc // Assuming 'filterDesc' is the updated description
//         };


//         // Get JWT token from localStorage (assuming you have authentication implemented)
//         const token = localStorage.getItem('token');

//         // Send PATCH request to update note on the backend
//         const response = await fetch(`https://apsonanotes.onrender.com/notes/${noteId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedNote) // Convert JS object to JSON string
//         });
//         console.log(response);

//         // Check if the request was successful
//         if (!response.ok) {
//             throw new Error('Failed to update note');
//         }

//         // Note updated successfully
//         const updatedNoteData = await response.json();
//         console.log('Note updated successfully:', updatedNoteData);

//         // Optionally, you can handle the updated note data here (e.g., update UI)

//     } catch (error) {
//         console.error('Error updating note:', error);
//         // Handle error (e.g., show error message to user)
//         alert('Failed to update note. Please try again.');
//     }
// }




let updateId = null;

// Function to populate and display the update form
function updateNote(noteId, title, filterDesc) {
    updateId = noteId;
    titleTag.value = title;
    descTag.value = filterDesc.replaceAll('<br/>', '\r\n'); // Replace <br/> with line breaks
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
    addBox.click(); // Open the popup box for editing
}




// // Global variables to track the update state
// let updateId = null;


// // Function to handle edit/update note action
// function updateNote(noteId, title, filterDesc) {
//     // Populate form fields with existing note data
//     updateId = noteId;
//     isUpdate = true;
//     titleTag.value = title;
//     descTag.value = filterDesc.replaceAll('<br/>', '\r\n'); // Replace <br/> with line breaks
//     popupTitle.innerText = "Update a Note";
//     addBtn.innerText = "Update Note";
//     addBox.click(); // Open the popup box for editing
// }


async function updateNoteOnServer() {
    try {
        const title = titleTag.value.trim();
        const content = descTag.value.trim();

        // Validate required fields
        if (!title) {
            alert('Please enter a title.');
            return;
        }

        const updatedNote = {
            title: title,
            content: content
        };

        const token = localStorage.getItem('token');

        const response = await fetch(`https://apsonanotes.onrender.com/notes/${updateId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedNote)
        });

        if (!response.ok) {
            throw new Error('Failed to update note');
        }

        const updatedNoteData = await response.json();
        console.log('Note updated successfully:', updatedNoteData);

        // Optionally, update UI or perform other actions upon successful update
        showNotes(); // Refresh the displayed notes after update

        // Close the popup box or perform other UI changes
        closePopup(); // Call a function to close the popup

    } catch (error) {
        console.error('Error updating note:', error);
        alert('Failed to update note. Please try again.');
    }
}





// Function to update note on the server
// async function updateNoteOnServer() {
//     try {
//         const title = titleTag.value.trim();
//         const content = descTag.value.trim();

//         // Validate required fields
//         if (!title) {
//             alert('Please enter a title.');
//             return;
//         }

//         // Prepare updated note data
//         const updatedNote = {
//             title: title,
//             content: content
//         };

//         const token = localStorage.getItem('token');

//         const response = await fetch(`https://apsonanotes.onrender.com/notes/${updateId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedNote)
//         });

//         if (!response.ok) {
//             throw new Error('Failed to update note');
//         }

//         const updatedNoteData = await response.json();
//         console.log('Note updated successfully:', updatedNoteData);

//         // Optionally, update UI or perform other actions upon successful update
//         showNotes(); // Refresh the displayed notes after update

//         // Close the popup box or perform other UI changes
//         closeIcon.click(); // Assuming closeIcon is defined and clickable

//     } catch (error) {
//         console.error('Error updating note:', error);
//         alert('Failed to update note. Please try again.');
//     }
// }

// Event listener for the update button click
addBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (isUpdate) {
        // If in update mode, call updateNoteOnServer to update the note
        updateNoteOnServer();
    } else {
        // Handle other actions if needed
    }
});




//Onlcik
addBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Extract form values
    const title = titleTag.value.trim();
    const content = descTag.value.trim();

    // Get the selected color and label values
    const noteColor = colorInput.value;
    const noteLabel = labelSelect.value;
    const noteTags = tagSelect.value;

    if (!title || !content) {
        alert('Please provide a title and description for the note.');
        return;
    }

    try {
        const currentDate = new Date();
        const month = months[currentDate.getMonth()];
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        // Construct the noteInfo object with color and label
        const noteInfo = {
            title: title,
            content: content,
            color: noteColor,
            tags: noteTags,
            labels: noteLabel,
            date: `${month} ${day}, ${year}`
        };

        const token = localStorage.getItem('token');

        const response = await fetch('https://apsonanotes.onrender.com/notes/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteInfo)
        });

        if (!response.ok) {
            throw new Error('Failed to save note');
        }

        const responseData = await response.json();

        // Optionally, handle the response data from the backend
        console.log('Note saved successfully:', responseData);

        // Clear form fields after successful submission
        titleTag.value = '';
        descTag.value = '';
        colorInput.value = '#ffffff'; // Reset color picker
        labelSelect.value = ''; // Reset label select

        // Optionally, update the local storage or fetch updated notes from backend
        // localStorage.setItem("notes", JSON.stringify(notes));
        // showNotes();

        alert('Note saved successfully!');
    } catch (error) {
        console.error('Error saving note:', error.message);
        alert('Failed to save note. Please try again.');
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    notes = await fetchNotesByUser();
    console.log("its", notes);
    showNotes();
    const noteForm = document.getElementById('noteForm');
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Create a new FormData object from the form
        const formData = new FormData(noteForm);
        console.log(formData);
    });
});


