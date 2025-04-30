import { FaPhotoVideo } from "react-icons/fa";

const CreatePost = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-start gap-4">
        {/* Placeholder profile pic */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>

        <div className="flex-1">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="What's on your mind?"
          ></textarea>

          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center gap-2 text-blue-600 cursor-pointer">
              <FaPhotoVideo />
              <input type="file" className="hidden" />
              <span className="text-sm font-medium">Add Photo/Video</span>
            </label>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
