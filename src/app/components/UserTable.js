import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faX } from "@fortawesome/free-solid-svg-icons";

export default function UserTable({ users, handleDelete, handleDisable }) {
  return (
    <table className="min-w-full table-auto mt-4 border-separate border-spacing-3">
      <thead>
        <tr className="border-b text-sm md:text-md">
          <th className="px-4 py-2 text-left bg-accent rounded">Name</th>
          <th className="px-4 py-2 text-left bg-accent rounded">ID</th>

          {/* Conditionally render these columns based on the user role */}
          {users[0]?.role === "affiliate" ? (
            <>
              <th className="px-4 py-2 text-left bg-accent rounded">Total Links</th>
              <th className="px-4 py-2 text-left bg-accent rounded">Total Clicks</th>
              <th className="px-4 py-2 text-left bg-accent rounded">Total Conversions</th>
              <th className="px-4 py-2 text-left bg-accent rounded">Total Revenue</th>
            </>
          ) : (
            <>
              <th className="px-4 py-2 text-left bg-accent rounded">Campaigns</th>
              <th className="px-4 py-2 text-left bg-accent rounded">Products</th>
            </>
          )}

          <th className="px-4 py-2 text-left bg-accent rounded">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user.userId} className="border-b text-sm md:text-md">
              <td className="px-4 py-2">
                <Link href={`/dashboard/campaigns/${user.userId}`} passHref>
                  {user.role === "affiliate" ? user.firstName + " " + user.lastName : user.businessName}
                </Link>
              </td>
              <td className="px-4 py-2">{user.userId || "N/A"}</td>

              {/* Conditionally render these cells based on the user role */}
              {user.role === "affiliate" ? (
                <>
                  <td className="px-4 py-2">{user.totalLinks || 0}</td>
                  <td className="px-4 py-2">{user.totalClicks || 0}</td>
                  <td className="px-4 py-2">{user.totalConversions || 0}</td>
                  <td className="px-4 py-2">{user.totalRevenue || 0}</td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2">{user.totalCampaigns || 0}</td>
                  <td className="px-4 py-2">{user.totalProducts || 0}</td>
                </>
              )}

              <td className="px-4 py-2 flex justify-between items-center">
                <FontAwesomeIcon
                  icon={user.disabled ? faCheck : faX}
                  className="cursor-pointer"
                  title={user.disabled ? "Enable" : "Disable"}
                  onClick={() => handleDisable(user.userId, user.disabled)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  title="Delete"
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDelete(user.userId)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center py-4 text-gray-500">No users to show</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
