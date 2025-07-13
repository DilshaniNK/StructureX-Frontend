import React from 'react'
import { CircleCheckBig, CircleMinus, Check } from 'lucide-react'

const Materials = () => {
  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900"> 2022/05/12
               
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600"> Home Land
                 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900"> cement, steel, bricks
                     
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">  1000, 500, 2000
                     
                    </div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">  Ramesh Peshala
                     
                    </div>
                  </td>
                  <td className=" flex px-6 py-4 whitespace-nowrap">
                    <button className=" flex p-3 bg-green-500 text-gray-900 cursor-pointer hover:bg-green-300  rounded-lg py-2 font-medium m-2">
                      <CircleCheckBig  size={20} className="m-1" />
                      Accpeted
                    </button>
                    <button className=" flex p-3 bg-red-600 text-gray-900 cursor-pointer hover:bg-red-400  rounded-lg py-2 font-medium m-2">
                      <CircleMinus size={20} className="m-1" />
                      Rejected
                    </button>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Materials