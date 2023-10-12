import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TimeTracker.css";
import { db } from './firebase';
import { collection, addDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';


function TimeTracker() {
  const [workType, setWorkType] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [workLog, setWorkLog] = useState([]);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get work log data from firestore and store it to workLog state
        const querySnapshot = await getDocs(collection(db, "workHours"));
        const data = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));

        setWorkLog(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  

  const handleAddWork = async (e) => {
    e.preventDefault();

    if (workType && workHours) {
      

      // add data to firestore, collection will be created automatically
      try {
        const docRef = await addDoc(collection(db, "workHours"), {
          date: today,
          type: workType,
          hours: parseFloat(workHours)
        });
        console.log("Document written with ID: ", docRef.id);

        const newWorkLog = {
          date: today,
          type: workType,
          hours: parseFloat(workHours),
          id: docRef.id
        };
  
        setWorkLog([...workLog, newWorkLog]);
        setWorkType("");
        setWorkHours("");

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const handleDelete = async e => {
    // delete item from firestore
    const docId = e.target.dataset.id;
    await deleteDoc(doc(db, "workHours", docId));

    // Find the index of the element with the desired ID
    const indexToDelete = workLog.findIndex(obj => obj.id === docId);

    // If the index is found (not -1), create a new array without the element
    if (indexToDelete !== -1) {
      const updatedArray = [...workLog];
      updatedArray.splice(indexToDelete, 1);

      // Update the state with the new array
      setWorkLog(updatedArray);
    }
  };

  const filterTodayWork = () => {
    return workLog.filter((entry) => entry.date === today);
  };

  const calculateTotalHours = () => {
    return filterTodayWork().reduce((total, entry) => total + entry.hours, 0);
  };

  useEffect(() => {
    // Calculate the total hours whenever the workLog changes
    calculateTotalHours();
  }, [workLog]);

  return (
    <div className="container mt-5">
      <form onSubmit={handleAddWork}>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label className="mb-2">Work Type:</label>
              <select
                className="form-control"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                required
              >
                <option value="">Select Work Type</option>
                <option value="customer project">Customer Project</option>
                <option value="internal meeting">Internal Meeting</option>
                <option value="internal support">Internal Support</option>
                <option value="self-studies">Self-Studies</option>
                <option value="office tasks">Office Tasks</option>
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="mb-2">Work Hours:</label>
              <input
                type="number"
                className="form-control"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                required
                step="0.25"
              />
            </div>
          </div>
          <div className="col d-flex justify-content-end align-items-end">
            <button className="btn btn-secondary" type="submit">
              Add Work
            </button>
          </div>
        </div>
      </form>

      <h2 className="mt-5 text-start">Work Hours {today}</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-striped mt-0">
          <thead>
            <tr>
              <th>Type</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {filterTodayWork().map((entry, index) => (
              <tr key={index}>
                <td>{entry.type} <button onClick={handleDelete} data-id={entry.id}>x</button></td>
                <td>{entry.hours}</td>
              </tr>
            ))}
            <tr>
              <td>Total Hours:</td>
              <td>{calculateTotalHours()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimeTracker;
