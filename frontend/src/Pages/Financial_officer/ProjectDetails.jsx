import React from 'react'

const ProjectDetails = () => {
    
      const [dropdownOpen, setDropdownOpen] = useState(false); // by default dropdown is collapse
    
      const toggleDropdown = () => { // toggle between states
        setDropdownOpen(!dropdownOpen);
      };
  return (
    <div>
        <h1>Project Name</h1>
        <div className='flex-1 min-w-[200px] bg-white p-6 rounded-lg shadow-md '>
            <div className='flex flex-col lg:flex-row gap-10'>
               <div>
                    <label>Project name :</label><span></span>
                    <label>Owner name :</label><span></span>
                    <label>Location :</label><span></span>
                    <label>eEstimated value :</label><span></span>
                </div>
                <div>
                    <label>Start-date :</label>
                    <label>Estimated end-date :</label>
                    <label>Remaining time :</label>
                </div>
            </div>
        </div>

        <div className='flex-1 min-w-[200px] bg-white p-6 rounded-lg shadow-md '>
            <h3>Owner details</h3>
            <button
                        className="text-gray-700"
                        onClick={toggleDropdown}
                        title="Toggle Dropdown"
                      >
                        {dropdownOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {dropdownOpen ? (
            <div>
                <label>full name :</label>
                <label>NIC :</label>
                <label>Address :</label>
                <label>Conatct no.:</label>
                <label>Email :</label>
            </div>
          ) : null}
        </div>

        <div className='flex-1 min-w-[200px] bg-white p-6 rounded-lg shadow-md '>
            <h3>Financial Summary</h3>
            <button
                        className="text-gray-700"
                        onClick={toggleDropdown}
                        title="Toggle Dropdown"
                      >
                        {dropdownOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {dropdownOpen ? (
            <div>
                <label>Esitimated value :</label>
                <label>Base Amount :</label>
                <label>Estimated Value :</label>
                <label>Amount Spent:</label>
                <label>Email :</label>
            </div>
          ) : null}
        </div>
    </div>
  )
}

export default ProjectDetails
