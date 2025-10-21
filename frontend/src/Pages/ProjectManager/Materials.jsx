import React, { useEffect, useState } from 'react'
import { CircleCheckBig, CircleMinus, Check } from 'lucide-react'
import axios from 'axios';
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';
import { useParams } from 'react-router-dom';

export default function Materials() {
  const [update, setUpdate] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { employeeId } = useParams();
  console.log("UserID from params:", employeeId);

  const handleAccept = async (requestId) => {
    try {
      console.log("Accepting request with ID:", requestId);
      setLoading(true);
      // Make sure we're passing the correct request ID format
      const response = await axios.put(`http://localhost:8086/api/v1/project_manager/requestSiteResources/${requestId}/Approved`);
      console.log("✅ Request accepted:", response.data);
      setError(null); // Clear any previous errors
      setSuccessMessage('Material request accepted successfully!');
      setShowSuccessAlert(true);
      // Refresh the data after successful acceptance
      fetchMaterialRequests();
    } catch (error) {
      console.error("❌ Error accepting request:", error);
      setError(`Failed to accept request: ${error.response?.data || error.message}`);
      setErrorMessage('Failed to accept material request. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      console.log("Rejecting request with ID:", requestId);
      setLoading(true);
      // Make sure we're passing the correct request ID format
      const response = await axios.put(`http://localhost:8086/api/v1/project_manager/requestSiteResources/${requestId}/Rejected`);
      console.log("✅ Request rejected:", response.data);
      setError(null); // Clear any previous errors
      setSuccessMessage('Material request rejected successfully!');
      setShowSuccessAlert(true);
      // Refresh the data after successful rejection
      fetchMaterialRequests();
    } catch (error) {
      console.error("❌ Error rejecting request:", error);
      setError(`Failed to reject request: ${error.response?.data || error.message}`);
      setErrorMessage('Failed to reject material request. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialRequests = () => {
    if (employeeId) {
      axios
        .get(`http://localhost:8086/api/v1/project_manager/pending-resources/${employeeId}`)
        .then((response) => {
          console.log("✅ Data from backend:", response.data);
          const data = response.data;
          if (data && typeof data === "object") {
            setUpdate(data);
            setSuccessMessage('Material requests loaded successfully!');
            setShowSuccessAlert(true);
          } else {
            setError("Invalid data format received from server");
            setErrorMessage("Invalid data format received from server");
            setShowErrorAlert(true);
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching updates:", error);
          setError("Failed to fetch material requests. Please try again later.");
          setErrorMessage("Failed to fetch material requests. Please try again later.");
          setShowErrorAlert(true);
        });
    }
  };

  useEffect(() => {
    fetchMaterialRequests();
  }, [employeeId])

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <CircleMinus className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Confirm Rejection</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to reject this request? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => {
                    handleReject(selectedRequestId);
                    setShowConfirmModal(false);
                    setSelectedRequestId(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-32 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
                >
                  Yes, Reject
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedRequestId(null);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md w-32 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Supervisor</th>
                <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(update).map(([requestKey, request]) => {
                if (!request?.resources || !request?.request_details) return null;

                return request.resources.map((resource, index) => (
                  <tr key={`${request.request_details?.request_id || requestKey}_${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {request.request_details.date ? new Date(request.request_details.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {request.request_details.project_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {resource.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {resource.quantity || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {request.request_details.site_supervisor_id || 'N/A'}
                      </div>
                    </td>
                    <td className="flex px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          console.log('Request details:', request.request_details);
                          handleAccept(request.request_details?.request_id || resource.request_id);
                        }}
                        disabled={loading}
                        className={`flex p-3 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-300'} text-gray-900 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} rounded-lg py-2 font-medium m-2`}
                      >
                        <CircleCheckBig size={20} className="m-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          console.log('Request details:', request.request_details);
                          setSelectedRequestId(request.request_details?.request_id || resource.request_id);
                          setShowConfirmModal(true);
                        }}
                        disabled={loading}
                        className={`flex p-3 ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-400'} text-gray-900 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} rounded-lg py-2 font-medium m-2`}
                      >
                        <CircleMinus size={20} className="m-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Alert */}
      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title="Success!"
        message={successMessage}
      />

      {/* Error Alert */}
      <ErrorAlert
        show={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        title="Error!"
        message={errorMessage}
      />
    </>
  )
}

