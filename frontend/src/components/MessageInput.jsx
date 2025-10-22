import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-3 md:p-4 border-t border-slate-700/50 bg-slate-900/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 text-xs"
              type="button"
            >
              <XIcon className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-2 md:gap-4 items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 input input-bordered bg-slate-800/50 border-slate-700/50 text-sm md:text-base py-2 md:py-3"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`btn btn-ghost btn-sm md:btn-md ${imagePreview ? "text-cyan-500" : "text-slate-400"}`}
        >
          <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="btn btn-primary btn-sm md:btn-md bg-gradient-to-r from-cyan-500 to-cyan-600 border-none text-white hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;