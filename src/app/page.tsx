'use client';

export default function Home() {
  const handleInit = async () => {
    try {
      const response = await fetch('/api/testing', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert('Router client initialized!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to initialize client');
    }
  };

  return (
    <div>
      <button 
        onClick={handleInit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Router Client
      </button>
    </div>
  );
}
