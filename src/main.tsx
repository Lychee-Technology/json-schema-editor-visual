import { createRoot } from 'react-dom/client';
import createSchemaEditor from '../package/index';
import '../package/styles/index.css';

const mock = [
  { name: 'String', mock: '@string' },
  { name: 'Natural Number', mock: '@natural' },
  { name: 'Float', mock: '@float' },
  { name: 'Character', mock: '@character' },
  { name: 'Boolean', mock: '@boolean' },
  { name: 'URL', mock: '@url' },
  { name: 'Domain', mock: '@domain' },
  { name: 'IP Address', mock: '@ip' },
  { name: 'ID', mock: '@id' },
  { name: 'GUID', mock: '@guid' },
  { name: 'Current Time', mock: '@now' },
  { name: 'Timestamp', mock: '@timestamp' },
];

const JsonSchemaEditor = createSchemaEditor({ mock });

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <a
            target="_blank"
            href="https://github.com/YMFE/json-schema-editor-visual"
            className="hover:text-primary-600"
          >
            <h1 className="text-3xl font-bold text-gray-900">JSON Schema Editor</h1>
          </a>
          <p className="mt-2 text-gray-600">
            A visual JSON Schema editor built with React, TypeScript, and Tailwind CSS.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Used in open source API platform:{' '}
            <a
              target="_blank"
              href="https://github.com/Lychee-Technology/forma"
              className="text-primary-600 hover:underline"
            >
              Forma
            </a>
          </h2>
        </section>

        <section>
          <hr className="mb-6" />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <JsonSchemaEditor
              showEditor={true}
              isMock={false}
              data=""
              onChange={(data) => {
                console.log('Schema changed:', data);
              }}
            />
          </div>
        </section>
      </div>
      <div className='flex items-center justify-center mt-5'>
        <div className="text-center">
          Made with <span>💖︎</span> by <a href="https://www.lychee.technology" className="text-decoration-none">Lychee Technology Inc.</a>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
