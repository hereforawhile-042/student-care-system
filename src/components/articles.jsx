const resources = [
    {
      title: "Understanding Anxiety",
      publisher: "MindSpace Publications",
      image: "https://picsum.photos/200/300",
    },
    {
      title: "Mental Health Matters",
      publisher: "Wellness Press",
      image: "https://picsum.photos/400/300",
    },
    {
      title: "Guide to Emotional Resilience",
      publisher: "Campus Wellness Initiative",
      image: "https://picsum.photos/220/300",
    },
    {
      title: "Guide to Emotional Resilience",
      publisher: "Campus Wellness Initiative",
      image: "https://picsum.photos/234/300",
    },
    {
      title: "Guide to Emotional Resilience",
      publisher: "Campus Wellness Initiative",
      image: "https://picsum.photos/222/300",
    },
    {
      title: "Guide to Emotional Resilience",
      publisher: "Campus Wellness Initiative",
      image: "https://picsum.photos/222/300",
    },
    {
      title: "Guide to Emotional Resilience",
      publisher: "Campus Wellness Initiative",
      image: "https://picsum.photos/222/300",
    },
  ];
  
  const ResourceList = () => {
    return (
      <div className="w-full bg-white rounded overflow-y-scroll max-h-96 p-4">
        <h3 className="text-lg font-semibold mb-4">More Support Resources</h3>
        <ul className="space-y-4">
          {resources.map((resource, index) => (
            <li key={index} className="flex items-start gap-2 border-b-2 pb-4">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-[40px] h-[40px] object-cover rounded-full"
              />
              <div>
                <h4 className="text-sm font-xs">{resource.title}</h4>
                <p className="text-sm text-gray-500">{resource.publisher}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ResourceList;
  