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
        axios.get("/api/users/get_users").then(res => res.data.users)

    },
    // A gyakorlat objektumhoz köthető API hívások
    exercise: {
        // Új gyakorlat hozzáadása
        addExercise: (exercise) => 
        axios.post("/api/exercises/add_exercise", {exercise}).then(res => res.data.exercise),

        // Gyakorlat előnézeti kép késztése
        createThumbnail: (data) => 
        axios.post("/api/exercises/create_thumbnail", {data}).then(res => res.data),

        // Gyakorlat videó anyagának feltöltése
        // Az uploadFile függvény a fájlok feltöltését végző AXIOS POST metódust hívja meg.
        //FONTOS: A korábbi POST/GET metódusokkal ellentétben nem JSON objektum kerül átadásra, helyette egy formData objektum és egy header konfiguráció kerül átadásra.
        // A header konfiguráció az alábbi: Conent-Type: "multipart/form-data". A POST metódus innen tudja, hogy nem alapértelmezett JSON objektumot kell feldolgozzon a kérés során.
        uploadFile: (formData) => 
        axios.post("/api/exercises/upload_file", formData, { "Content-Type": "multipart/form-data"}).then(res => res.data),

        // Az elérhető összes gyakorlat lekérése
        getExercises: (user) =>
        axios.post("/api/exercises/get_exercises", {user}).then(res => res.data.exercises),

        // Az felhasználó(edző) által kezelt gyakorlatok lekérése
        // A két kérés összevonható lenne, azonban lehetőséget szeretnék biztosítani az esetleges különböző adattartamok lekérésére
        getMyExercises: () =>
        axios.post("/api/exercises/get_my_exercises").then(res => res.data.exercises)
    },
    // Az edzésekhez köthető API hívások
    workout: {
        addWorkout: (workout) => 
        axios.post("/api/workouts/add_workout", {workout}).then(res => res.data.exercise),

        uploadFile: (formData) => 
        axios.post("/api/workouts/upload_file", formData, { "Content-Type": "multipart/form-data"}).then((res) => res.data),

        deleteFile: (file) => 
        axios.post("/api/workouts/delete_file", {file}),

        getWorkouts: () =>
        axios.post("/api/workouts/get_workouts").then(res => res.data.workouts),
    },
    // Az edzésprogramokkal kapcsolatos API hívások
    program: {
        addProgram: (program) => 
        axios.post("/api/programs/add_program", {program}).then(res => res.data.program),

        uploadFile: (formData) => 
        axios.post("/api/programs/upload_file", formData, { "Content-Type": "multipart/form-data"}).then((res) => res.data),

        deleteFile: (file) => 
        axios.post("/api/programs/delete_file", {file}),

        getPrograms: () =>
        axios.post("/api/programs/get_programs").then(res => res.data.programs),
    },
    // A végrehajtott befizetésekkel kapcsolatos API hívások
    purchase: {
        addPurchase: (purchase) =>
        axios.post("/api/purchases/add_purchase", {purchase}),

        getPurchases: (user) =>
        axios.post("/api/purchases/get_purchases", {user})
    },
}

export default api; 