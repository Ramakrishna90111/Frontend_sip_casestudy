export default function Header() {
  return (
    <div className="px-[200px] bg-black text-white flex flex-row items-center justify-between">
      <img
        width={"300px"}
        src="https://media.licdn.com/dms/image/v2/D5612AQF2a3w6KSWWdA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1675007152298?e=2147483647&v=beta&t=yiHyMxJ8zPL5_gfLv6YwU46FhhPwmB1YCv0duA390SY"
        //src="https://img-cdn.publive.online/fit-in/1200x675/entrackr/media/post_attachments/wp-content/uploads/2023/04/KFintech.jpg"
      />
      <div className="flex flex-row space-x-4">
      <p>Solutions</p>
      <p>Products</p>
      <p>About Us</p>
      <p>Portfolio Companies</p>
      </div>
      <div className="flex flex-row space-x-4">
      <p>Careers</p>
      <p>Blog</p>
      <p>Contact</p>
      <p>News Letter</p>
      </div>
    </div>
  );
}