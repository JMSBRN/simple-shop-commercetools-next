import React from 'react';
import styles from './SocialLinks.module.scss';
import socialMediaImages from '../../../public/data/social-media-images.json';
import Image from 'next/legacy/image';
import Link from 'next/link';

function SocialLinks() {

    return <div className={styles.socialLinks}>
        {socialMediaImages['social-media-links'].map((el) => (
            <div key={el.name}>
                <Link href="/" target="blank">
                    <Image width={80} height={80} src={'/social_media_icons/facebook.png'} alt={el.name} />
                </Link>
            </div>
        ))}
    </div>;
}

export default SocialLinks;
