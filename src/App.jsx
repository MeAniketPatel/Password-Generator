import React, { useState, useCallback, useEffect, useRef } from 'react';

const App = () => {
  // State variables
  const [length, setLength] = useState(4);
  const [color, setColor] = useState('#8B0000');
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharacterAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('good');

  // useRef hook for password input
  const passwordRef = useRef(null);

  // Callback to generate password
  const passwordGenerator = useCallback(() => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str += '0123456789';
    if (characterAllowed) str += '!@"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

    // Updated: Ensure charIndex is within the bounds of str length
    for (let index = 0; index < length; index++) {
      const charIndex = Math.floor(Math.random() * str.length);
      // const charIndex = Math.floor(Math.random() * str.length + 1); // out of bound
      pass += str.charAt(charIndex);
    }

    setPassword(pass);
  }, [length, numberAllowed, characterAllowed]);

  // Callback to copy password to clipboard
  const copyPasswordToClipboard = useCallback(() => {
    if (passwordRef.current) {
      passwordRef.current.select();
      // passwordRef.current.setSelectionRange(); not necessary

      window.navigator.clipboard.writeText(password);
    }
  }, [password]);

  // Function to update password strength status
  const updateStatus = () => {
    let newStatus;
    let newColor;

    if (length <= 4) {
      newStatus = 'Very Weak';
      newColor = '#b83704';
    } else if (length <= 7) {
      newStatus = 'Weak';
      newColor = '#e34f42';
    } else if (length <= 11) {
      newStatus = 'Strong';
      newColor = '#82e874';
    } else {
      newStatus = 'Very Strong';
      newColor = '#24de0b';
    }

    setStatus(newStatus);
    setColor(newColor);
  };

  // useEffect to regenerate password and update status on relevant state changes
  useEffect(() => {
    passwordGenerator();
    updateStatus();
  }, [length, numberAllowed, characterAllowed, passwordGenerator]);

  return (
    <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
      <h1 className='text-white text-center my-3'>Password Generator</h1>

      {/* Password Generated Area */}
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={password}
          className="outline-none w-full py-1 px-3"
          placeholder="Password"
          readOnly
          ref={passwordRef}
        />
        <button
          onClick={copyPasswordToClipboard}
          className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 active:bg-blue-400'
        >
          Copy
        </button>
      </div>

      {/* Password Strength Status */}
      <div className='flex text-sm gap-x-2 items-center justify-center m-2'>
        <div
          className='items-center justify-center text-white px-6 py-3 rounded-2xl'
          style={{ backgroundColor: color }}
        >
          {status}
        </div>
      </div>

      {/* Controls for length, numbers, and special characters */}
      <div className='flex text-sm gap-x-2'>
        <div className='flex items-center gap-x-1'>
          <input
            type="range"
            min={4}
            max={20}
            value={length}
            className='cursor-pointer'
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <label>Length: {length}</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={numberAllowed}
            id="numberInput"
            onChange={() => setNumberAllowed(prev => !prev)}
          />
          <label htmlFor="numberInput">Numbers</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={characterAllowed}
            id="characterInput"
            onChange={() => setCharacterAllowed(prev => !prev)}
          />
          <label htmlFor="characterInput">Characters</label>
        </div>
      </div>
    </div>
  );
};

export default App;
