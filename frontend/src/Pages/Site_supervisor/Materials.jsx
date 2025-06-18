// MaterialsPage.js
import Inventory from '../../Components/Site_supervisor/InventoryRequest';

const materials = [
  { name: 'Cement Bags' },
  { name: 'Sand (tons)'},
  { name: 'Steel Rods'},
];

const projects = ['Site A', 'Site B', 'Site C'];

export default function MaterialsPage() {
  return (
    <Inventory
      title="Materials Request Form"
  type="Materials"
  items={materials}
  projects={[
    'Colombo Highrise Project',
    'Galle Road Mall Construction',
  ]}
    />
  );
}
