import axios from "axios";


const api = {
    // A felhasználókhoz köthető API hívások (pl.: regisztráció, autentikáció, stb...)
    user: {
        login: (credentials) => 
        axios.post("/api/auth", {credentials}).then(res => res.data.user),

        register: (user) =>
        axios.post("/api/users", {user}).then(res => res.data.user),

        confirm: (token) =>
        axios.post("/api/auth/confirmation", {token}).then(res => res.data.user),

        resetPasswordRequest: (email) =>
        axios.post("api/auth/reset_password_request", {email}),

        validateToken: (token) =>
        axios.post("/api/auth/validate_token", {token}),

        resetPassword: (data) =>
        axios.post("/api/auth/reset_password", {data}),

        changePassword: (data) =>
        axios.post("/api/auth/change_password", {data}),

        updateMyProfile: (data) =>
        axios.post("/api/users/update_profile", {data}).then(res => res.data.user),

        getUserInfo: (data) => 
        axios.post("api/users/get_user_info", {data}).then(res => res.data.user),

        updateUserProfile: (data) =>
        axios.post("api/users/edit_user", {data}).then(res => res.data.user),

        getAllUsers: () =>
        axios.get("/api/users/get_users").then(res => res.data.users),

        updateMembership: (data) =>
        axios.post("api/users/membership", {data}).then(res => res.data.user),

        deleteUser: (user) => 
        axios.post("/api/users/delete_user", {user}),

    },
    // A gyakorlat objektumhoz köthető API hívások
    exercise: {
        // Új gyakorlat hozzáadása
        addExercise: (exercise) => 
        axios.post("/api/exercises/add_exercise", {exercise}).then(res => res.data.exercise),

        updateExercise: (exercise) => 
        axios.post("/api/exercises/update_exercise", {exercise}).then(res => res.data.exercise),

        deleteExercise: (exercise) => 
        axios.post("/api/exercises/delete_exercise", {exercise}),

        // Gyakorlat előnézeti kép késztése
        createThumbnail: (data) => 
        axios.post("/api/exercises/create_thumbnail", {data}).then(res => res.data),

        // Gyakorlat videó anyagának feltöltése
        // Az uploadFile függvény a fájlok feltöltését végző AXIOS POST metódust hívja meg.
        //FONTOS: A korábbi POST/GET metódusokkal ellentétben nem JSON objektum kerül átadásra, helyette egy formData objektum és egy header konfiguráció kerül átadásra.
        // A header konfiguráció az alábbi: Conent-Type: "multipart/form-data". A POST metódus innen tudja, hogy nem alapértelmezett JSON objektumot kell feldolgozzon a kérés során.
        uploadFile: (formData) => 
        axios.post("/api/exercises/upload_file", formData, { "Content-Type": "multipart/form-data"}).then(res => res.data),

        deleteFiles: (data) => 
        axios.post("/api/exercises/delete_files", {data}),

        // Az elérhető összes gyakorlat lekérése
        getExercises: (user) =>
        axios.post("/api/exercises/get_exercises", {user}).then(res => res.data.exercises),

        // Egy konkrét gyakorlat lekérdezése
        getExercise: (exercise) =>
        axios.post("/api/exercises/get_exercise", {exercise}).then(res => res.data.exercise),

    },
    // Az edzésekhez köthető API hívások
    workout: {
        addWorkout: (workout) => 
        axios.post("/api/workouts/add_workout", {workout}).then(res => res.data.workout),

        updateWorkout: (workout) => 
        axios.post("/api/workouts/update_workout", {workout}).then(res => res.data.workout),

        deleteWorkout: (workout) => 
        axios.post("/api/workouts/delete_workout", {workout}),

        uploadFile: (formData) => 
        axios.post("/api/workouts/upload_file", formData, { "Content-Type": "multipart/form-data"}).then((res) => res.data),

        deleteFile: (file) => 
        axios.post("/api/workouts/delete_file", {file}),

        getWorkouts: (user) =>
        axios.post("/api/workouts/get_workouts", {user}).then(res => res.data.workouts),

        getWorkout: (workout) =>
        axios.post("/api/workouts/get_workout", {workout}).then(res => res.data.workout),
    },
    // Az edzésprogramokkal kapcsolatos API hívások
    program: {
        addProgram: (program) => 
        axios.post("/api/programs/add_program", {program}).then(res => res.data.program),

        updateProgram: (program) => 
        axios.post("/api/programs/update_program", {program}).then(res => res.data.program),

        deleteProgram: (program) => 
        axios.post("/api/programs/delete_program", {program}),

        uploadFile: (formData) => 
        axios.post("/api/programs/upload_file", formData, { "Content-Type": "multipart/form-data"}).then((res) => res.data),

        deleteFile: (file) => 
        axios.post("/api/programs/delete_file", {file}),

        getPrograms: (user) =>
        axios.post("/api/programs/get_programs", {user}).then(res => res.data.programs),

        getProgram: (program) =>
        axios.post("/api/programs/get_program", {program}).then(res => res.data.program),
    },
    // A végrehajtott befizetésekkel kapcsolatos API hívások
    purchase: {
        addPurchase: (purchase) =>
        axios.post("/api/purchases/add_purchase", {purchase}),

        getPurchases: (user) =>
        axios.post("/api/purchases/get_purchases", {user}),
    },
    // A naptár eseményekkel kapcsolatos API hívások
    event: {
        addEvent: (event) =>
        axios.post("/api/events/add_event", {event}),

        getEvents: (user) =>
        axios.post("/api/events/get_events", {user}).then(res => res.data.events),
    },
}

export default api; 