// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router";

// Local Imports
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function InnerItem({
  title,
  data
}) {
  console.log(data)
  return (
    <Card>
      <div className="px-4 pb-8 text-center sm:px-5">
        <h4 className="text-lg mt-3 font-semibold text-gray-800 dark:text-dark-100">
          {title}
        </h4>
        <Button
          className="mt-8"
          color="primary"
          component={Link}
          isGlow
        >
          Add
        </Button>
      </div>
    </Card>
  );
}

InnerItem.propTypes = {
  title: PropTypes.string,
  data: PropTypes.elementType,
};
