import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding Issues and Meetings data...\n');

  // ============================================
  // ISSUES
  // ============================================
  console.log('🔧 Creating Issues...');
  
  const issueData = [
    {
      title: 'Broken water pipe near Mosque entrance',
      description: 'There is a water leak from the main pipe near the entrance of the mosque. Water is pooling and causing slippery conditions.',
      raisedDate: new Date('2024-10-15'),
      status: 'resolved',
      resolution: 'Plumber was called and the pipe was replaced. Area was cleaned and dried.',
      resolvedDate: new Date('2024-10-18'),
    },
    {
      title: 'Need for additional parking space',
      description: 'During Friday prayers, there is not enough parking space for all attendees. Many cars are parked on the road causing traffic issues.',
      raisedDate: new Date('2024-11-01'),
      status: 'in_progress',
    },
    {
      title: 'Madrasa classroom AC not working',
      description: 'The air conditioner in classroom 2 of the Madrasa has stopped working. Children are uncomfortable during hot afternoons.',
      raisedDate: new Date('2024-11-20'),
      status: 'open',
    },
    {
      title: 'Request for youth sports program',
      description: 'Several parents have requested organizing a sports program for youth during weekends to engage them in healthy activities.',
      raisedDate: new Date('2024-12-01'),
      status: 'open',
    },
    {
      title: 'Elderly assistance program needed',
      description: 'Some elderly community members living alone need assistance with groceries and medical checkups.',
      raisedDate: new Date('2024-12-10'),
      status: 'in_progress',
    },
    {
      title: 'Streetlight near Mahalla 2 not working',
      description: 'The streetlight at the corner of Mahalla 2 has been broken for 2 weeks. Area is very dark at night.',
      raisedDate: new Date('2024-09-20'),
      status: 'closed',
      resolution: 'Reported to municipal council. They fixed the light.',
      resolvedDate: new Date('2024-10-05'),
    },
    {
      title: 'Drainage issue during rainy season',
      description: 'Water logging occurs near houses 15-20 during heavy rains. Need proper drainage system.',
      raisedDate: new Date('2024-08-15'),
      status: 'resolved',
      resolution: 'New drainage pipes installed. Water now flows properly to the main drain.',
      resolvedDate: new Date('2024-09-10'),
    },
    {
      title: 'Request for Quran classes for adults',
      description: 'Several adults have expressed interest in learning Quran recitation. Need to arrange evening classes.',
      raisedDate: new Date('2024-12-15'),
      status: 'open',
    },
  ];

  // Get some people to link as raisers
  const raisers = await prisma.person.findMany({ take: 8 });

  let issuesCreated = 0;
  for (let i = 0; i < issueData.length; i++) {
    try {
      await prisma.issue.create({
        data: {
          ...issueData[i],
          raisedBy: raisers[i % raisers.length]?.id,
        },
      });
      issuesCreated++;
    } catch (e) {
      // Skip if exists
    }
  }
  console.log(`   ✅ Created ${issuesCreated} issues`);

  // ============================================
  // MEETINGS
  // ============================================
  console.log('📅 Creating Meetings...');
  
  const meetingsData = [
    {
      title: 'Monthly Board Meeting - October 2024',
      meetingDate: new Date('2024-10-05'),
      meetingTime: new Date('1970-01-01T19:00:00'),
      location: 'Mosque Meeting Hall',
      attendees: 'All board members, Imam, Secretary',
      agenda: '1. Review of monthly finances\n2. Upcoming Eid preparations\n3. Maintenance issues\n4. Sandaa collection status',
      minutes: 'Meeting started at 7 PM. Discussed financial status - all good. Eid committee formed with 5 members. Maintenance issues noted - water pipe needs fixing. Sandaa collection at 85%.',
    },
    {
      title: 'Monthly Board Meeting - November 2024',
      meetingDate: new Date('2024-11-02'),
      meetingTime: new Date('1970-01-01T19:00:00'),
      location: 'Mosque Meeting Hall',
      attendees: 'All board members except Treasurer (excused), Imam',
      agenda: '1. Eid event review\n2. Winter aid program planning\n3. Youth program proposal\n4. Budget review',
      minutes: 'Eid event was successful. Decided to start winter aid distribution from Dec 1. Youth sports program approved pending venue arrangement.',
    },
    {
      title: 'Emergency Meeting - Flood Relief',
      meetingDate: new Date('2024-11-15'),
      meetingTime: new Date('1970-01-01T10:00:00'),
      location: 'Community Center',
      attendees: 'Board members, Community leaders, Volunteers',
      agenda: '1. Assess flood damage in community\n2. Relief fund allocation\n3. Volunteer coordination',
      minutes: '15 families affected. Allocated Rs. 500,000 for immediate relief. 20 volunteers registered. Distribution to start tomorrow.',
    },
    {
      title: 'Monthly Board Meeting - December 2024',
      meetingDate: new Date('2024-12-07'),
      meetingTime: new Date('1970-01-01T19:00:00'),
      location: 'Mosque Meeting Hall',
      attendees: 'All board members, Imam, Secretary',
      agenda: '1. Year-end financial review\n2. Flood relief update\n3. Annual report preparation\n4. Next year planning',
      minutes: 'Financial position healthy. Flood relief completed successfully. Annual report draft to be ready by Dec 20. Planning committee formed for 2025.',
    },
    {
      title: 'Youth Program Planning Meeting',
      meetingDate: new Date('2024-12-10'),
      meetingTime: new Date('1970-01-01T16:00:00'),
      location: 'Community Center',
      attendees: 'Youth committee members, 3 parent representatives',
      agenda: '1. Sports activities selection\n2. Schedule planning\n3. Budget allocation\n4. Safety measures',
      minutes: 'Decided on cricket and football. Every Saturday 4-6 PM. Budget of Rs. 50,000 approved. First aid kit to be purchased.',
    },
    {
      title: 'Annual General Meeting 2024',
      meetingDate: new Date('2024-12-20'),
      meetingTime: new Date('1970-01-01T18:30:00'),
      location: 'Mosque Main Hall',
      attendees: 'All community members',
      agenda: '1. Annual report presentation\n2. Financial statement review\n3. Election of new committee members\n4. Community feedback',
    },
  ];

  const createdMeetings = [];
  for (const meeting of meetingsData) {
    try {
      const created = await prisma.meeting.create({
        data: meeting,
      });
      createdMeetings.push(created);
    } catch (e) {
      // Skip if exists
    }
  }
  console.log(`   ✅ Created ${createdMeetings.length} meetings`);

  // ============================================
  // MEETING DECISIONS
  // ============================================
  console.log('📝 Creating Meeting Decisions...');
  
  const openIssues = await prisma.issue.findMany({ where: { status: 'open' }, take: 2 });
  
  const decisionsData = [
    { meetingIndex: 0, decision: 'Approved Rs. 25,000 for water pipe repair' },
    { meetingIndex: 0, decision: 'Eid committee to include 5 members from different mahallas' },
    { meetingIndex: 1, decision: 'Winter aid distribution budget set at Rs. 200,000' },
    { meetingIndex: 1, decision: 'Youth sports program approved - to start in January', issueIndex: 0 },
    { meetingIndex: 2, decision: 'Emergency fund of Rs. 500,000 released for flood relief' },
    { meetingIndex: 2, decision: '20 volunteers assigned for relief distribution' },
    { meetingIndex: 3, decision: 'Annual report deadline set for December 20' },
    { meetingIndex: 3, decision: 'Planning committee of 7 members formed for 2025' },
    { meetingIndex: 4, decision: 'Cricket and football selected for youth program', issueIndex: 0 },
    { meetingIndex: 4, decision: 'First session scheduled for January 6, 2025' },
  ];

  let decisionsCreated = 0;
  for (const decision of decisionsData) {
    if (createdMeetings[decision.meetingIndex]) {
      try {
        await prisma.meetingDecision.create({
          data: {
            meetingId: createdMeetings[decision.meetingIndex].id,
            decision: decision.decision,
            relatedIssueId: decision.issueIndex !== undefined ? openIssues[decision.issueIndex]?.id : null,
          },
        });
        decisionsCreated++;
      } catch (e) {
        // Skip if exists
      }
    }
  }
  console.log(`   ✅ Created ${decisionsCreated} meeting decisions`);

  // Summary
  const issueCounts = await prisma.issue.count();
  const meetingCounts = await prisma.meeting.count();
  const decisionCounts = await prisma.meetingDecision.count();

  console.log('\n========================================');
  console.log('🎉 Issues and Meetings data added!');
  console.log('========================================\n');
  console.log(`   • Issues: ${issueCounts}`);
  console.log(`   • Meetings: ${meetingCounts}`);
  console.log(`   • Meeting Decisions: ${decisionCounts}`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });






