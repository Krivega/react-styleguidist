import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Link from 'rsg-components/Link';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import { useStyleGuideContext } from 'rsg-components/Context';
import { getHash } from '../../utils/handleHash';

const styles = ({ color, fontFamily, fontSize, space, mq }: Rsg.Theme) => ({
	list: {
		margin: 0,
		paddingLeft: space[2],
	},
	item: {
		color: color.base,
		display: 'block',
		margin: [[space[1], 0, space[1], 0]],
		fontFamily: fontFamily.base,
		fontSize: fontSize.base,
		listStyle: 'none',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	isChild: {
		[mq.small]: {
			display: 'inline-block',
			margin: [[0, space[1], 0, 0]],
		},
	},
	heading: {
		color: color.base,
		marginTop: space[1],
		fontFamily: fontFamily.base,
		fontWeight: 'bold',
	},
	isSelected: {
		fontWeight: 'bold',
	},
});

interface ComponentsListRendererProps extends JssInjectedProps {
	items: Rsg.Component[];
	forceOpen?: boolean;
}

export const ComponentsListRenderer: React.FunctionComponent<ComponentsListRendererProps> = ({
	classes,
	items,
	forceOpen,
}) => {
	const {
		config: { pagePerSection },
	} = useStyleGuideContext();

	const visibleItems = items.filter(item => item.visibleName);

	if (!visibleItems.length) {
		return null;
	}

	// Match selected component in both basic routing and pagePerSection routing.
	const { hash, pathname } = window.location;
	const windowHash = pathname + (pagePerSection ? hash : getHash(hash));
	return (
		<ul className={classes.list}>
			{visibleItems.map(({ heading, visibleName, href, content, shouldOpenInNewTab }) => {
				const isItemSelected = windowHash === href;
				const isSectionOpen = forceOpen || (href && windowHash.indexOf(href) === 0);
				return (
					<li
						className={cx(classes.item, {
							[classes.isChild]: (!content || !content.props.items.length) && !shouldOpenInNewTab,
							[classes.isSelected]: isItemSelected,
						})}
						key={href}
					>
						<Link
							className={cx(heading && classes.heading)}
							href={href}
							target={shouldOpenInNewTab ? '_blank' : undefined}
						>
							{visibleName}
						</Link>
						{isSectionOpen ? content : null}
					</li>
				);
			})}
		</ul>
	);
};

ComponentsListRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	items: PropTypes.array.isRequired,
	forceOpen: PropTypes.bool,
};

export default Styled<ComponentsListRendererProps>(styles)(ComponentsListRenderer);
