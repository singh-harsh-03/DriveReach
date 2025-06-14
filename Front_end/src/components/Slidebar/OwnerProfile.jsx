const OwnerProfile = () => {
    const ownerName = localStorage.getItem("ownerName") || "Owner";
  
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4">Profile Settings</h2>
        <div className="border p-4 rounded shadow-md bg-white">
          <p><strong>Name:</strong> {ownerName}</p>
          <p><strong>Email:</strong> owner@example.com</p>
          <p><strong>Phone:</strong> +91-9876543210</p>
        </div>
      </div>
    );
  };
  
  export default OwnerProfile;
  