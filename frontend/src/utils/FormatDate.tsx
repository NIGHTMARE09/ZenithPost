export const formatDate = (dateString: string) =>{
    try{
        return new Date(dateString).toLocaleDateString("en-US",{
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }
    catch(error){
        console.error("Error formatting date:", error);
        return "Invalid Date"; // Return the original string if formatting fails
    }
}