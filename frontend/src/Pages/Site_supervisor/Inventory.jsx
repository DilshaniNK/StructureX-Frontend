// ToolsPage.js
import Inventory from '../../Components/Site_supervisor/InventoryRequest';



const projects = ['Site A', 'Site B', 'Site C'];

export default function ToolsPage() {
  return (
    <Inventory
      title="Tool Request Form"
  type="Tool"
  items={[
    { name: 'Drill' },
    { name: 'Hammer' },
    { name: 'Screwdriver' },
  ]}
  projects={[
    'Colombo Highrise Project',
    'Galle Road Mall Construction',
  ]}
    />
  );
}
