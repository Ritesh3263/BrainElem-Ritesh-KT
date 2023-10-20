

export const renderUserAvatar=(role, userPermissions)=>{
    switch (role){
        case "Root": return "Root";
        case "EcoManager": return "EcoMan";
        case "NetworkManager": return "NetworkMan";
        case "ModuleManager": return "ModuleMan";
        case "Assistant": return "ModuleMan"; // add new icon later
        case "Architect": return "Architect";
        case "Librarian": return "Librarian";
        case "Trainee": return "Student";
        case "Parent": return "Parent";
        case "Trainer": return userPermissions.isClassManager? "ClassMan" : "Teacher";
        default:  return "Student";
    }
}