
'use client';
import Link from 'next/link'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Team } from '@/lib/types';
import { getTeamMembers } from '@/lib/team-api';

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    // Load team members from database
    useEffect(() => {
        const loadTeamMembers = async () => {
            try {
                setLoading(true);
                const members = await getTeamMembers();
                // Sort by order field for proper display order
                const sortedMembers = members.sort((a, b) => a.order - b.order);
                setTeamMembers(sortedMembers);
            } catch (error) {
                console.error('Error loading team members:', error);
                // Fallback to empty array if API fails
                setTeamMembers([]);
            } finally {
                setLoading(false);
            }
        };

        loadTeamMembers();
    }, []);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Loading state
    if (loading) {
        return (
            <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
                <div className="mx-auto container border-t px-6">
                    <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">Team</span>
                    <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
                        <div className="sm:w-2/5">
                            <h2 className="text-3xl font-bold sm:text-4xl">Our dream team</h2>
                        </div>
                        <div className="mt-6 sm:mt-0">
                            <p>Loading our amazing team members...</p>
                        </div>
                    </div>
                    <div className="mt-12 md:mt-24 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto container border-t px-6">
                <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">Team</span>
                <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
                    <div className="sm:w-2/5">
                        <h2 className="text-3xl font-bold sm:text-4xl">Our dream team</h2>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <p>Meet the talented individuals who make our vision a reality. Each member brings unique expertise and passion to drive innovation and excellence.</p>
                    </div>
                </div>
                
                {teamMembers.length === 0 ? (
                    <div className="mt-12 md:mt-24 text-center">
                        <p className="text-muted-foreground">No team members found. Please check back later.</p>
                    </div>
                ) : (
                    <motion.div 
                        className="mt-12 md:mt-24"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {teamMembers.map((member, index) => (
                                <motion.div 
                                    key={member.id} 
                                    className="group overflow-hidden"
                                    variants={itemVariants}
                                    whileHover={{ y: -8 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {/* Use imageUrl if available, otherwise fallback to imageId */}
                                    {member.imageUrl ? (
                                        <img 
                                            className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" 
                                            src={member.imageUrl} 
                                            alt={member.name}
                                            onError={(e) => {
                                                // Fallback to placeholder if image fails to load
                                                e.currentTarget.src = '/images/team/placeholder.jpg';
                                            }}
                                        />
                                    ) : (
                                        <Image 
                                            className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" 
                                            src={`/images/team/${member.imageId || 'placeholder.jpg'}`} 
                                            alt={member.name}
                                            width={826}
                                            height={1239}
                                        />
                                    )}
                                    <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                        <div className="flex justify-between">
                                            <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{member.name}</h3>
                                            <span className="text-xs">_0{member.order || index + 1}</span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.position}</span>
                                            <Link 
                                                href={member.socialLinks?.linkedin || member.socialLinks?.email ? `mailto:${member.socialLinks.email}` : '#'} 
                                                className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                                            >
                                                {' '}
                                                Connect
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
