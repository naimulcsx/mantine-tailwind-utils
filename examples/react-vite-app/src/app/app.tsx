import { Button } from '../components';

export function App() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Button</h1>
      <div className="flex gap-4">
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary">Small</Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
        <Button variant="primary" size="xl">
          Extra Large
        </Button>
      </div>
    </div>
  );
}

export default App;
