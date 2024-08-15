import React, { useState } from 'react';
import { ChevronRightIcon } from "@heroicons/react/solid"
import classNames from 'classnames';
import A from 'components/A';

const BreadcrumbAccordion = ({ items }) => {
  const [currentItems, setCurrentItems] = useState(items)
  const [breadcrumbList, setBreadcrumbList] = useState([])

  const handleItemClick = (item, index) => {
    if (item.children) {
      setBreadcrumbList([...breadcrumbList, item])
      setCurrentItems(item.children)
    }
    // when item has no children, but has content - this then focuses in on content
    else if (item.content && item.label) {  // the "item.label" prevents bug of creating infinite breadcrumbs when clicking on content
      setBreadcrumbList([...breadcrumbList, item])
      setCurrentItems([{ content: item.content }])
    } else if (item.onClick) {
      item.onClick()
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index === breadcrumbList.length - 1) {
      return  // this prevents any fx when clicking on crumb you are already on
    } else if (index === -1) {
      setBreadcrumbList([])
      setCurrentItems(items)
    } else {
      const selectedBreadcrumb = breadcrumbList[index]
      setBreadcrumbList(breadcrumbList.slice(0, index + 1))
      setCurrentItems(selectedBreadcrumb?.children || selectedBreadcrumb?.content)
    }
  }

  return (
    <div className="w-full text-white">
      {/* ze bweadcwumb */}
      {breadcrumbList.length > 0 && (
        <div className="mb-4 flex items-center text-sm text-gray-400">
          <span
            className="cursor-pointer hover:underline font-bold text-white"
            onClick={() => handleBreadcrumbClick(-1)}
          >
            home
          </span>
          {breadcrumbList.map((crumb, index) => (
            <React.Fragment key={index}>
              <ChevronRightIcon className="w-4 h-4 mx-2" />
              <span
                className={classNames(
                  "cursor-pointer hover:underline",
                  index === breadcrumbList.length - 1 ? 'font-bold text-white' : ''
                )}
                onClick={() => handleBreadcrumbClick(index)}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div>
        {currentItems.map((item, index) => (
          <div key={index}>
            {item.href ? (
              <A
                className={classNames(
                  (!item.label && item.content) ? '' : ' hover:bg-[#1d8f89]/50 cursor-pointer', // dont want these styles if this is just showing content and not a label
                  "block border-2 border-white mb-2 rounded-xl p-4 text-left"
                )}
                onClick={() => handleItemClick(item, index)}
                href={item.href}
              >
                {item.label && <span>{item.label}</span>}
                {!item.label && item.content && <div className="text-white">{item.content}</div>}
              </A>
            ): (
              <div
                className={classNames(
                  (!item.label && item.content) ? '' : ' hover:bg-[#1d8f89]/50 cursor-pointer', // dont want these styles if this is just showing content and not a label
                  item.onClick ? '' : '',
                  "relative block border-2 border-white mb-2 rounded-xl p-4 text-left"
                )}
                onClick={() => handleItemClick(item, index)}
              >
                {item.label && <span>{item.label}</span>}
                {!item.label && item.content && <div className="text-white">{item.content}</div>}
                {item.label && !item.onClick && <ChevronRightIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 mx-2" />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadcrumbAccordion;
