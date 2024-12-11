import React, { useState } from "react";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    sinnumber: "",
    bankaccount: "",
    transit: "",
    hourlyrate: "",
    workedhours: "",
    taxes: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Add employee handler
  const addEmployeeHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous message

    try {
      const response = await fetch("http://localhost:8080/api/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee), // Send the entire employee object
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add employee.");
      }
      setMessage("Employee added successfully!");
      setEmployee({ // Reset the form after successful submission
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        sinnumber: "",
        bankaccount: "",
        transit: "",
        hourlyrate: "",
        workedhours: "",
        taxes: ""
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={addEmployeeHandler}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={employee.firstname}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={employee.lastname}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={employee.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phonenumber"
          placeholder="Phone Number"
          value={employee.phonenumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="sinnumber"
          placeholder="SIN Number"
          value={employee.sinnumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="bankaccount"
          placeholder="Bank Account"
          value={employee.bankaccount}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="transit"
          placeholder="Transit Number"
          value={employee.transit}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="hourlyrate"
          placeholder="Hourly Rate"
          value={employee.hourlyrate}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="workedhours"
          placeholder="Worked Hours"
          value={employee.workedhours}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="taxes"
          placeholder="Taxes"
          value={employee.taxes}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
