import  { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import Crublibrary, { sayHelloFromLibrary } from 'crublibrarydhruv';
import { ToastContainer, toast } from 'react-toastify';

type Todo = {
  txHash: string;
  value: string;
  id?: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [credits, setCredits] = useState<number | null>(null);
  const [error,] = useState<string | null>(null);
  const [apiKey,] = useState<string | null>(null); // use (import.meta.env.VITE_API_KEY || null) after getting api key
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<string | null>(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleRechargeRequest = async () => {
    if (!apiKey) {
      toast('API key is missing');
      return;
    }

    const crud = new Crublibrary({ apiKey: apiKey, apiUrl: apiUrl });


    try {
      const res:any = await crud.recharge();
      await fetchTodos();
      toast(`${res.message}`);
    } catch (error : any) {
      console.error('Recharge request error:', error);
    }
  };

  const fetchTodos = async () => {
    if (!apiKey) return;

    console.log("apiKey : ", apiKey);

    setIsLoading(true);
    sayHelloFromLibrary();

    const crud = new Crublibrary({ apiKey: apiKey, apiUrl: apiUrl });

    try {
      const res = await crud.get() as { todos: Todo[]; credits: number };
      setTodos(res.todos);
      setCredits(4 - res.credits);
      console.log('Fetched todos:', res.todos);
    } catch (error: any) {
      if (error.message === "Request limit exceeded. Please recharge credits.") {
        toast("Request limit exceeded. Please recharge credits.");
        setCredits(0);
        return;
      } else if (error.message === "API Key is required") {
        toast('API Key is required');
      } else if (error.message === "Invalid API Key") {
        toast('Invalid API Key');
      } else {
        console.log(`Error fetching todos: ${error.message}`);
        toast('Failed to fetch todos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [apiKey]);

  const handleLogin = () => {
    window.location.href = 'https://crub-library-backend.onrender.com/auth/google/callback';
  };

  const handleCreate = async () => {
    if (credits !== null && credits <= 0) {
      toast('Credits exhausted. Please recharge by mailing support.');
      return;
    }

    if (!apiKey) {
      toast('API key is missing');
      return;
    }

    if (newTodo === "") {
      toast('Missing value');
      return;
    }

    setIsLoading(true);
    const crud = new Crublibrary({ apiKey: apiKey, apiUrl: apiUrl });

    try {
      const newTodoObj = { value: newTodo };
      await crud.create(newTodoObj);
      if (credits !== null) setCredits(credits - 1);
      setNewTodo('');
      fetchTodos();
    } catch (error: any) {
      if (error.message === "Missing value") {
        toast('Missing value');
      } else {
        toast('Failed to create todo');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (txHash: string) => {
    if (credits !== null && credits <= 0) {
      toast('Credits exhausted. Please recharge by mailing support.');
      return;
    }

    if (!apiKey) {
      toast('API key is missing');
      return;
    }

    setLoadingTodoId(txHash);
    const crud = new Crublibrary({ apiKey: apiKey, apiUrl: apiUrl });

    try {
      await crud.delete(txHash);
      if (credits !== null) setCredits(credits - 1);
      await fetchTodos();
    } catch (error) {
      toast('Failed to delete todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleUpdate = async () => {
    if (!apiKey || !editingTodo) {
      toast('Missing data for update');
      return;
    }

    setIsLoading(true);
    const crud = new Crublibrary({ apiKey: apiKey, apiUrl: apiUrl });

    try {
      const updatedTodo = { ...editingTodo, value: newTodo };
      console.log("Updated todo:", updatedTodo);
      await crud.update(updatedTodo.txHash, updatedTodo.value);
      setNewTodo('');
      setEditingTodo(null);
      fetchTodos();
      toast('Todo updated');
    } catch (error) {
      toast('Failed to update todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <ToastContainer />
      {apiKey && credits === 0 && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 max-w-xs animate-fade-in z-10 border border-blue-100">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Please recharge my credits
            </p>
            <button
              onClick={handleRechargeRequest}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">📋 Todo App</h1>

        {error && <Notification message={error} type="error" />}

        {!apiKey ? (
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <div>
            {isLoading && todos.length === 0 ? (
              <div className="flex justify-center my-6">
                <Loader size="large" />
              </div>
            ) : (
              <ul className="space-y-3 mb-4">
                {todos.map((todo) => (
                  <li
                    key={todo.txHash}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-3 rounded-lg shadow-sm gap-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-800">{todo.value}</span>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0 min-w-[60px] justify-end">
                      {loadingTodoId === todo.txHash ? (
                        <Loader size="small" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleDelete(todo.txHash)}
                            className="text-red-500 hover:text-red-700 font-semibold"
                            disabled={isLoading || loadingTodoId !== null}
                          >
                            ✖
                          </button>
                          <button
                            onClick={() => {
                              setEditingTodo(todo);
                              setNewTodo(todo.value);
                            }}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                            disabled={isLoading || loadingTodoId !== null}
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter new todo"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isLoading || loadingTodoId !== null}
              />
              <button
                onClick={editingTodo ? handleUpdate : handleCreate}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center min-w-[80px]"
                disabled={isLoading || loadingTodoId !== null}
              >
                {isLoading ? <Loader size="small" color="text-white" /> : editingTodo ? 'Update' : 'Add'}
              </button>
            </div>

            <p className="text-sm text-gray-600 text-right">
              Credits remaining: <span className="font-semibold text-blue-600">{credits}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;